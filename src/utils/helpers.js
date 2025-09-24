import User from "../models/users.models.js";

export const transferBetweenUsers = async (req, res) => {
  try {
    const { userId } = req.user;
    const { amount, receiverAccount } = req.body;

    const accountNum = parseFloat(req.body.amount).toFixed(2).trim();

    if (isNaN(accountNum) || accountNum <= 0) {
      return res.status(400).send({
        success: false,
        message: "Invalid amount, amount must be a positive number",
      });
    }

    if (!accountNum) {
      return res
        .status(400)
        .send({ success: false, message: "amount is required" });
    }
    if (!receiverAccount) {
      return res
        .status(400)
        .send({ success: false, message: "bank account number is required" });
    }
    if (!/^\d{10}$/.test(receiverAccount)) {
      return res.status(400).send({
        success: false,
        message: "bank account number must be 10 digits",
      });
    }

    // Find sender and receiver
    const sender = await User.findById(userId);
    const receiver = await User.findOne({
      "bankDetails.accountNo": receiverAccount,
    });
    console.log("Sender:", sender);
    console.log("Receiver:", receiver);

    if (!sender || !receiver) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    if (sender.bankDetails?.accountNo === receiverAccount) {
      return res
        .status(400)
        .send({ success: false, message: "You cannot transfer to yourself" });
    }
    // Check if sender has enough balance
    if (sender.availableBalance < accountNum) {
      return res
        .status(400)
        .send({ success: false, message: "Insufficient balance" });
    }

    // Perform the transfer
    sender.availableBalance -= accountNum;
    receiver.availableBalance += accountNum;

    await sender.save();
    await receiver.save();

    res.status(200).send({ success: true, message: "Transfer successful" });
  } catch (error) {
    console.error("Error transferring between users:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

// controller to fetch by his account number
export const fetchUserByAccountNumber = async (req, res) => {
  try {
    const { accountNo } = req.params;
    console.log("Account Number:", accountNo);

    if (!accountNo) {
      return res
        .status(400)
        .send({ success: false, message: "Account number is required" });
    }

    const user = await User.findOne({ "bankDetails.accountNo": accountNo });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .send({ success: true, ownerName: user.firstName + " " + user.lastName });
  } catch (error) {
    console.error("Error fetching user by account number:", error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};
