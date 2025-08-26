import User from "../models/users.models.js";
import bcrypt from "bcrypt";

export const bankDetails = async (req, res) => {
  try {
    const { userId } = req.user;

    const { accountNo, bank, accountname } = req.body;

    if (!accountNo || !bank || !accountname) {
      return res
        .status(400)
        .send({ success: false, message: "the fields are required" });
    }

    const bankDatails = {
      accountNo,
      bank,
      accountname,
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

// user withdrawal  Settings pin  controllers

export const createWithdrawalPin = async (req, res) => {
  try {
    const { withdrawalPin } = req.body;
    const { userId } = req.user;

    if (!withdrawalPin) {
      return res
        .status(400)
        .send({ success: false, message: "withdrawal pink is required" });
    }

    if (!/^\d{4}$/.test(withdrawalPin)) {
      return res.status(400).send({
        success: false,
        message: "your pink must be   4 digits  a number only",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "user not found" });
    }
    if (user.withdrawalSettings.withdrawalPin) {
      return res
        .status(400)
        .send({ success: false, message: "user already has a withdral pin" });
    }

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
    const { withdrawalPin, newWithdrawalPin, newWithdrawalPinAgain } = req.body;

    if (!withdrawalPin || !newWithdrawalPin || !newWithdrawalPinAgain) {
      return res
        .status(401)
        .send({ success: false, message: "all fields are required" });
    }

    if (newWithdrawalPin !== newWithdrawalPinAgain) {
      return res
        .status(401)
        .send({ success: false, message: "withMdrawals pin dot not match" });
    }

    if (!/^\d{4}$/.test(newWithdrawalPin)) {
      return res.status(400).send({
        success: false,
        message: "your withdrawal pin must be exactly 4 digits (numbers only)",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "user not found",
      });
    }

    if (!user.withdrawalSettings) user.withdrawalSettings = {};
    if (user.withdrawalSettings.withdrawalPin) {
      const isPinMatch = await bcrypt.compare(
        withdrawalPin,
        user.withdrawalSettings.withdrawalPin
      );

      if (!isPinMatch) {
        return res.status(401).send({
          success: false,
          message: "Invalid withdrawal pin ",
        });
      }
    }


    await user.save();
    res.status(200).send({
      success: true,
      message: "withdrawal pin updated successfuly",
    });
  } catch (error) {
    console.error("server error", error);
    return res
      .status(500)
      .send({ success: false, message: "internal server error" });
  }
};
