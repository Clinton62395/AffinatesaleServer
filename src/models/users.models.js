import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Base_Url } from "../utils/constant.utils.js";

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },

    lastName: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      toLowerCase: true,
    },

    phoneNumber: { type: String, required: true },

    password: {
      type: String,
      required: true,
      trim: true,
      minLength: [5, "password cannot be less than 5 characters"],
      maxLength: [100, "password cannot be more than 100 characters"],
    },

    resetpasswordToken: { type: String },
    resetpasswordExpiresToken: { type: Date },

    referralCode: { type: String, trim: true },

    country: { type: String, required: true, trim: true },
    rank: {
      type: String,
      enum: ["Beginner", "Intermediate", "Expert"],
      default: "Beginner",
    },

    availableBalance: {
      type: Number,
      default: 0,
    },
    totalEarning: {
      type: Number,
      default: 0,
    },

    payouts: {
      type: Number,
      default: 0,
    },

    totalRefferal: {
      type: Number,
      default: 0,
    },

    affiliateLink: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
    },

    bank: {
      orangeMoney: { type: String },
      opay: { type: String },
      mobileMoney: { type: String },
    },

    currency: {
      type: String,
      enum: ["USD", "NGN"], // tu peux ajouter d'autres devises ici
      default: "USD",
    },

    // user bank infomation

    bankDetails: {
      accountname: { type: String },
      accountNo: { type: Number, default: 0 },
      bank: { type: String },
    },
    // user password updates

    // Withdrawal Settings
    withdrawalSettings: {
      withdrawalPin: { type: String },
    },
  },

  { timestamps: true }
);

// hash withdrawal  password pin before adding to database

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  if (this.isModified("withdrawalPin")) {
    const pinkSalt = await bcrypt.genSalt(12);
    this.withdrawalPin = await bcrypt.hash(
      String(this.withdrawalPin),
      pinkSalt
    );
  }
  next();
});

userSchema.pre("save", function (next) {
  if (!this.referralCode) {
    this.referralCode = crypto.randomUUID().split("-")[0];
  }
  if (!this.affiliateLink) {
    this.affiliateLink = `${Base_Url}register?ref=${this.referralCode}`;
  }
  next();
});

const User = model("User", userSchema);

export default User;
