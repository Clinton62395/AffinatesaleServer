import User from "../models/users.models.js";

export const fetchDashboardStistics = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) {
      return res.status(401).send({
        success: false,
        message: "you need to be connected to your dashboard",
      });
    }
    console.log("user id ", userId);
    // const user = await User.findById(userId);

    const user = await User.findById(userId)
      .select(
        "firstName lastName   email rank  referralCode availableBalance payouts image totalEarning totalRefferal affiliateLink bankDetails bank currency  country withdrawalSettings phoneNumber"
      )
      .lean();
    console.log("data fetch ", user);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "user not found" });
    }

    const withdrawalPin = !!user.withdrawalSettings?.withdrawalPin || null;

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: { ...user, hasPin: withdrawalPin }, // Send the found user object
    });
  } catch (err) {
    console.error("error occured when fetching user details", err);
    if (err.name === "castError") {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Id format" });
    }
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .send({ success: false, message: "validation error" });
    }
    return res
      .status(500)
      .send({ success: false, message: "internal server  error" });
  }
};
