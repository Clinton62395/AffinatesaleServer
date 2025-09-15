import User from "../models/users.models.js";
import { Base_Url } from "../utils/constant.utils.js";

export const updateNewField = async (req, res) => {
  try {
    const user = await User.updateMany(
      {},
      [
        {
          $set: {
            affiliateLink: {
              $concat: [Base_Url, "?referralCode=", "$referralCode"],
            },
            totalEarning: { $ifNull: ["$totalEarning", 0] },

            rank: {
              $ifNull: ["$rank", "Beginner"],
            },

            image: { $ifNull: ["$image", ""] },

            country: { $ifNull: ["$country", "Nigeria"] },

            bank: {
              $ifNull: [
                "$bank",
                { orangeMoney: "", opay: "", mobileMoney: "" },
              ],
            },

            currency: {
              $ifNull: ["$currency", "USD"],
            },
          },
        },
      ],
      { upsert: false, runValidators: true }
    );

    res
      .status(200)
      .json({ success: true, message: "Fields updated successfully", user });
  } catch (error) {
    console.error("internal server error", error);
    return res
      .status(400)
      .json({ success: false, message: "Error occurred when updating field" });
  }
};
