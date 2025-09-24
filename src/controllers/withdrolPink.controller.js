// import User from "../models/users.models.js";
// import bcrypt from "bcrypt";

// // set withdral pin

// const setWithdralwalPink = async (req, res) => {
//   try {
//     const { userId } = req.user;

//     const data = req.body;

//     const requiredFields = ["withdrawalPin", "newWithdrawalPin", "confirmPin"];

//     for (const field of requiredFields) {
//       if (!data[field]) {
//         return res
//           .status(400)
//           .send({ success: false, message: `${field} is required` });
//       }

//       if (data[field].length !== 4) {
//         return res
//           .status(400)
//           .send({ success: false, message: `${field} must be 4 digits` });
//       }
//     }

//     if (data.newWithdrawalPin !== data.confirmPin) {
//       return res.status(400).send({
//         success: false,
//         message: "New Pin and Confirm Pin do not match",
//       });
//     }

//     const user = await User.findById(userId);

//     if (!user) {
//       return res
//         .status(404)
//         .send({ success: false, message: "User not found" });
//     }

//     if (!user.withdrawalSettings) {
//       user.withdrawalSettings = {};
//     }

//     if (user.withdrawalSettings.withdrawalPin !== data.newWithdrawalPin) {
//       return res.status(400).send({
//         success: false,
//         message: "Current Pin is incorrect",
//       });
//     }

//     const isPinkMatch = await bcrypt.compare(
//       data.withdrawalPin,
//       user.withdrawalSettings.withdrawalPin
//     );
//     if (!isPinkMatch) {
//       return res
//         .status(401)
//         .send({ success: false, message: "Invalid current withdrawal pin" });
//     }

//     user.withdrawalSettings.withdrawalPin = data.newWithdrawalPin;
//     await user.save();

//     res
//       .status(200)
//       .send({ success: true, message: "Withdrawal Pin updated successfully" });
//   } catch (error) {
//     console.error("Error setting withdrawal pin:", error);
//     return res
//       .status(500)
//       .send({ success: false, message: "Internal Server Error" });
//   }
// };
