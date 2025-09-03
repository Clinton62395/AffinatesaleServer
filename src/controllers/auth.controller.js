import User from "../models/users.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import admin from "firebase-admin";

import serviceAccount from "../config/serviceAccountKey.json" with { type: "json" };
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

    const userToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
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
      token: userToken,
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

    if (
      !data.firstName ||
      !data.lastName ||
      !data.phoneNumber ||
      !data.referralCode ||
      !data.password ||
      !data.email ||
      !data.country
    ) {
      return res
        .status(400)
        .send({ success: false, message: "All fields are required" });
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

    const affliateLink = `https://affinatesales/users/${data.referralCode}`;

    //  Create the new user
    const newUser = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      email: data.email.toLowerCase(),
      referralCode: data.referralCode,
      country: data.country,
      password: data.password,
      affliateLink,
    });

    // JWT token for the new user
    const userToken = jwt.sign(
      { email: newUser.email, userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(201).send({
      success: true,
      message: "User has been created successfully",
      user: newUser,
      userToken,
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

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).send({
      success: true,
      message: "Login successful",
      token,
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
