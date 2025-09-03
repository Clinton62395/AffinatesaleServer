import User from "../models/users.models.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
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
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "user not found" });
    }

    // reset pssword token

    const resetToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    const hashToken = await bcrypt.hash(resetToken, 10);
    user.resetpasswordToken = hashToken;

    user.resetpasswordExpiresToken = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `http://localhost:8800/reset-password?token=${resetToken}&id=${user._id}`;
    await transporter.sendMail({
      from: '"Support App" <support@app.com>',
      to: email,
      subject: "Réinitialisation de mot de passe",
      text: `Clique ici pour réinitialiser ton mot de passe: ${resetLink}`,
      html: `<p>Clique ici pour réinitialiser ton mot de passe: 
              <a href="${resetLink}">Réinitialiser</a></p>`,
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
    const { newPassword, token } = req.body;

    if (!newPassword || !token) {
      return res
        .status(400)
        .send({ success: false, message: "new password and token is required" });
    }

    const jwtToken = token.split("&")[0];

    let decodedToken;

    try {
      decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);
      if (!decodedToken) {
        return res
          .status(400)
          .send({ success: false, message: "token not valid or expired" });
      }
    } catch (error) {
      console.error("token error");
      return res
        .status(400)
        .send({ success: false, message: "token invalid or expired" });
    }

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "user not found" });
    }

    const isTokenMatch = await bcrypt.compare(
      jwtToken,
      user.resetpasswordToken
    );
    if (!isTokenMatch) {
      return res.status(400).send({ success: false, message: "invalid token" });
    }

    if (user.resetpasswordExpiresToken < Date.now()) {
      return res
        .status(400)
        .send({ success: false, message: " token has expired" });
    }

    const hashNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashNewPassword;
    user.resetpasswordExpiresToken = undefined;
    user.resetpasswordToken = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Mot de passe mis à jour avec succès.",
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
