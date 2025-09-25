import User from "../models/users.models.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { transporter } from "../config/mailer.js";
dotenv.config();
export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .send({ success: false, message: "user email is required " });
    }

    const resetToken = crypto.randomBytes(30).toString("hex");
    const hashToken = await bcrypt.hash(resetToken, 10);

    const user = await User.findOneAndUpdate(
      { email: email },
      {
        resetpasswordToken: hashToken,
        resetpasswordExpiresToken: Date.now() + 15 * 60 * 1000,
      }
    );

    // reset pssword token
    const VARCEL_URL = process.env.VERCEL_URL;
    const FRONTEND_URL = process.env.FRONTEND_URL || VARCEL_URL;

    const resetLink = `${FRONTEND_URL}/auth/reset-password?token=${resetToken}&id=${user._id}`;
    await transporter.sendMail({
      from: '"Support App" <support@app.com>',
      to: email,
      subject: "Reset password",
      text: `click here to update your password: ${resetLink} /n Note, the reset password will be expired after 15 minutes.`,
      html: `<p>click here to update your passwod: 
              <a href="${resetLink}">Update password</a> <br/> Note the reset password will be expired after 15 minutes.</p>`,
    });

    res
      .status(200)
      .send({ success: true, message: "reset password link sent " });
    console.log("email sent ");
  } catch (error) {
    console.error("internal server error", error.message);
    res.status(500).send({ success: false, message: "server error" });
  }
};

// update user password

export const updatePassword = async (req, res) => {
  try {
    // const { id } = req.params;
    const { newPassword, token, id } = req.body;
    console.log("newpasse password", newPassword ? "here" : "absent");
    console.log("token ", token ? "here" : "absent");
    console.log("req. body ", req.body);

    if (!newPassword || !token || !id) {
      console.log("password, ", !!newPassword || !!token);
      return res.status(400).send({
        success: false,
        message: "new password and token is required",
      });
    }

    const user = await User.findOne({
      _id: id,
      resetpasswordExpiresToken: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "user not found or token has expired",
      });
    }

    const isTokenMatch = await bcrypt.compare(token, user.resetpasswordToken);
    if (!isTokenMatch) {
      return res.status(400).send({ success: false, message: "invalid token" });
    }

    const updateUser = await User.findOneAndUpdate(
      {
        _id: id,
        resetpasswordExpiresToken: { $gt: Date.now() },
      },
      {
        password: newPassword,
        resetpasswordExpiresToken: "",
        resetpasswordToken: "",
      },
      { new: true, runValidators: true }
    );
    if (!updateUser) {
      return res.status(400).send({
        success: false,
        message: "token has been used during process or token has expired",
      });
    }

    res.status(200).json({
      success: true,
      message: "password updated successfully.",
    });
  } catch (error) {
    console.error("internal server error", error.message);
    if (error.name === "CastError") {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Id format" });
    }

    if (error.name === "ValidationError") {
      return res
        .status(400)
        .send({ success: false, message: "validation error" });
    }

    return res.status(500).send({ success: false, message: "server error" });
  }
};

// update password controller in the dashboard

export const changePasswordDashboard = async (req, res) => {
  try {
    const { userId } = req.user;
    const data = req.body;

    const requiredFields = [
      "currentPassword",
      "newPassword",
      "newPasswordAgain",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return res
          .status(400)
          .send({ success: false, message: `${field} is required` });
      }
    }

    if (data.newPassword !== data.newPasswordAgain) {
      return res
        .status(401)
        .send({ success: false, message: "passwords do not match" });
    }
    if (data.newPassword.length < 5 || data.newPassword.length > 15)
      return res.status(401).send({
        success: false,
        message:
          "password cannot be less than 5 characters and more than 15 characters",
      });

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "user not found" });
    }

    const isPasswordMatch = await bcrypt.compare(
      data.currentPassword,
      user.password
    );

    if (!isPasswordMatch) {
      return res
        .status(401)
        .send({ success: false, message: "Invalid current password" });
    }

    user.password = data.newPassword;
    console.log("new password before saving ===>", data.newPassword);
    await user.save();

    res.status(200).send({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
};
