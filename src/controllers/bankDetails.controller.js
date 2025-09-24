import User from "../models/users.models.js";
import bcrypt from "bcrypt";

export const bankDetails = async (req, res) => {
  try {
    const { userId } = req.user;

    const data = req.body;
    const requiredFields = ["accountNo", "country", "bank", "phoneNumber"];

    for (const field of requiredFields) {
      if (!data[field]) {
        return res
          .status(400)
          .send({ success: false, message: `${field} is required` });
      }
    }

    const bankDatails = {
      accountNo: data.accountNo,
      phoneNumber: data.phoneNumber,
      bank: data.bank,
      accountname: data.accountname,
      country: data.country,
    };

    const userBankUpdate = await User.findByIdAndUpdate(
      userId,
      { bankDatails },

      {
        new: true,
        runValidators: true,
      }
    );

    if (!userBankUpdate) {
      return res
        .status(404)
        .send({ success: false, message: "user bank details not found" });
    }

    res.status(200).send({
      success: true,
      message: "bank details updated successfully",
      user: userBankUpdate,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .send({ success: false, message: "Invalid id format" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).send({
        success: false,
        message: "validation error",
        error: error.message,
      });
    }
  }
};

// user password update controllers

export const passwordUdapte = async (req, res) => {
  try {
    const { userId } = req.user;
    const { currentPassword, newPassword, newPasswordAgain } = req.body;

    if (!currentPassword || !newPassword || !newPasswordAgain) {
      return res
        .status(401)
        .send({ success: false, message: "all fields are required" });
    }

    if (newPassword !== newPasswordAgain) {
      return res
        .status(401)
        .send({ success: false, message: "passwords dot not match" });
    }
    if (newPassword.length < 5 || newPassword.length > 15)
      return res.status(401).send({
        success: false,
        message:
          "passwort cannot be less than 5 characters and more than 15 charaters",
      });

    const updatedPassword = await User.findByIdAndUpdate(
      userId,
      { infoUpdated },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).send({
      success: true,
      message: "bank info updated successfuly",
      data: infoUpdated,
    });
  } catch (error) {
    console.error("server error", error);
    return res
      .status(500)
      .send({ success: false, message: "internal server error" });
  }
};

//initial user withdrawal  Settings pin  controllers

export const createWithdrawalPin = async (req, res) => {
  try {
    const { newPink, confirmPin } = req.body;
    console.log("information from body==>", req.body);

    console.log("information from body withdrawal==>", !!newPink);

    const { userId } = req.user;

    if (!newPink || !confirmPin) {
      return res
        .status(400)
        .send({ success: false, message: "❌withdrawal pink is required" });
    }

    if (!/^\d{4}$/.test(newPink)) {
      return res.status(400).send({
        success: false,
        message: "your pink must be   4 digits  a number only",
      });
    }

    if (newPink !== confirmPin) {
      return res
        .status(400)
        .send({ success: false, message: "pins do not match" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "user not found" });
    }

    if (!user.withdrawalSettings) {
      user.withdrawalSettings = {};
    }

    if (user.withdrawalSettings.withdrawalPin) {
      return res
        .status(400)
        .send({ success: false, message: "user already has a withdral pin" });
    }

    user.withdrawalSettings.withdrawalPin = newPink;
    await user.save();

    res.status(200).send({
      success: true,
      message: "user withdrawal pin created successfully",
    });
  } catch (error) {
    console.error("internal server error", error);
    return res.status(500).send({ success: false, message: "server error" });
  }
};
// user withdrawal  Settings pin update controllers

export const withdrawalPinUpdate = async (req, res) => {
  try {
    const { userId } = req.user;

    const data = req.body;

    const requiredFields = ["withdrawalPin", "newWithdrawalPin", "confirmPin"];

    for (const field of requiredFields) {
      if (!data[field]) {
        return res
          .status(400)
          .send({ success: false, message: `${field} is required` });
      }

      if (data[field].length !== 4) {
        return res
          .status(400)
          .send({ success: false, message: `${field} must be 4 digits` });
      }
    }

    if (data.newWithdrawalPin !== data.confirmPin) {
      return res.status(400).send({
        success: false,
        message: "New Pin and Confirm Pin do not match",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    if (!user.withdrawalSettings) {
      user.withdrawalSettings = {};
    }

    if (user.withdrawalSettings.withdrawalPin !== data.newWithdrawalPin) {
      return res.status(400).send({
        success: false,
        message: "Current Pin is incorrect",
      });
    }

    const isPinkMatch = await bcrypt.compare(
      data.withdrawalPin,
      user.withdrawalSettings.withdrawalPin
    );
    if (!isPinkMatch) {
      return res
        .status(401)
        .send({ success: false, message: "Invalid current withdrawal pin" });
    }

    user.withdrawalSettings.withdrawalPin = data.newWithdrawalPin;
    await user.save();

    res
      .status(200)
      .send({ success: true, message: "Withdrawal Pin updated successfully" });
  } catch (error) {
    console.error("Error setting withdrawal pin:", error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
};
