import User from "../models/users.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import admin from "firebase-admin";
import crypto from "crypto";

import serviceAccount from "../config/serviceAccountKey.json" with { type: "json" };
import { refreshToken } from "firebase-admin/app";
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
// prettier ignore

dotenv.config();

// social login facebook and google through firebase google

export const socialRegister = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res
        .status(400)
        .send({ success: false, message: "authorization token is required" });
    }
    const idToken = token.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, name, email, picture } = decodedToken;

    // save

    if (!email) {
      return res
        .status(400)
        .send({ success: false, message: "email is required" });
    }

    const newUser = {
      uid,
      email: email.toLowerCase(),
      name: name || "",
      picture: picture || "",
    };

    console.log(newUser);
    let user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      newUser,
      { upsert: true, new: true, runValidators: false }
    );
    if (!user) {
    }

    // jwt

    const acess_token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    const refresh_token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).send({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      accessToken: acess_token,
      refreshtoken: refresh_token,
    });
  } catch (error) {
    console.error("social register error ", error);
    return res
      .status(500)
      .send({ success: false, message: " internal server error" });
  }
};

// Register controller
export const register = async (req, res) => {
  try {
    const data = req.body;
    console.log("data from user", data);
    const requiredFields = [
      "firstName",
      "lastName",
      "phoneNumber",
      "password",
      "email",
      "country",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return res
          .status(400)
          .send({ success: false, message: `${field} is required` });
      }
    }

    const existingUser = await User.findOne({
      email: data.email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "Email already exists",
      });
    }

    let usedReferralCode = null;
    if (data.referralCode) {
      const refOwnerCode = await User.findOne({
        referralCode: data.referralCode,
      });
      console.log("ref owner code", refOwnerCode);
      if (refOwnerCode) {
        refOwnerCode.availableBalance += 2;
        refOwnerCode.totalRefferal += 1;
        const result = await refOwnerCode.save();
        console.log("ref owner code updated", result);
        usedReferralCode = data.referralCode;
      }
    }

    //  Create the new user
    const newUser = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      email: data.email.toLowerCase(),
      country: data.country,
      password: data.password,
      usedReferralCode: usedReferralCode,
      referralCode: crypto.randomUUID().split("-")[0],
    });

    // refferal link
    const VARCEL_URL = process.env.VERCEL_URL;
    const FRONTEND_URL = process.env.FRONTEND_URL || VARCEL_URL;
    newUser.affiliateLink = `${FRONTEND_URL}/auth/sign-up?ref=${newUser.referralCode}`;

    await newUser.save();
    // JWT token for the new user
    const acess_token = jwt.sign(
      { email: newUser.email, userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const refresh_token = jwt.sign(
      { email: newUser.email, userId: newUser._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).send({
      success: true,
      message: "User has been created successfully",
      user: newUser,
      accessToken: acess_token,
      refreshToken: refresh_token,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
};

// Login controller
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("password error message", password);
    console.log("full information of request", req.body);

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .send({ success: false, message: "Invalid password" });
    }

    const acess_token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    const refresh_token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).send({
      success: true,
      message: "Login successful",
      accessToken: acess_token,
      refreshToken: refresh_token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).send({ success: false, message: "Server error" });
  }
};

// create new refresh token for user

export const refreshTokenController = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(400)
      .send({ success: false, message: "refresh token is required" });
  }
  try {
    const refresh_Token = process.env.JWT_REFRESH_SECRET;
    const JWT_SECRET = process.env.JWT_SECRET;

    const decodedToken = jwt.verify(refreshToken, refresh_Token);

    const newAccessToken = jwt.sign(
      { userId: decodedToken.userId, email: decodedToken.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).send({
      success: true,
      message: "new refresh token created successfully",
      accessToken: newAccessToken,
    });
    // const newRefreshToken=
  } catch (error) {
    console.error("error when creating token", error);
    res.status(403).send({ success: false, message: "invalid token" });
  }
};

export const TestLogin = (req, res) => {
  const { name, age } = req.body;
  return res.status(200).send({ message: "Success", data: { name, age } });
};
