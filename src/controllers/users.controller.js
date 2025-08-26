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
