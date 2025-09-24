import User from "../models/users.models.js";

export const getDashboardStats = async (req, res) => {
  const { email } = req.user;
  const user = await User.find({ email });
  console.log(user);
  return res.status(200).send({
    success: true,
    message: "Dashboard details fetched succeffully",
    data: {
      affliateLink: user[0].affliateLink,
    },
  });
};

// controller for user profile picture updating

export const updateProfilePicture = async (req, res) => {
  const { userId } = req.user;
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).send({ message: "image url is invalid" });
  }
  const userProfile = await User.findByIdAndUpdate(
    userId,
    { image: imageUrl },
    { new: true }
  );
  if (!userProfile) {
    return res.status(404).send({ message: "User not found" });
  }

  res.status(200).send({
    success: true,
    message: "user image profile updated successfully",
    user: userProfile,
  });
};
