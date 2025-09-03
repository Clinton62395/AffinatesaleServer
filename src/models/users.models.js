import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

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

    referralCode: { type: String, required: true, trim: true },

    country: { type: String, required: true, trim: true },
    rank: {
      type: String,
      enum: ["Beginner", "Intermediate", "Expert"],
    },

    availableBalance: {
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

    affliateLink: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
    },
    // user bank infomation

    bankDatails: {
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
  try {
    const salt = await bcrypt.genSalt(10);

    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, salt);
    }

    if (this.isModified("withdrawalPin")) {
      this.withdrawalPin = await bcrypt.hash(String(this.withdrawalPin), salt);
    }

    next();
  } catch (error) {
    next(error);
  }
});

const User = model("User", userSchema);

export default User;
