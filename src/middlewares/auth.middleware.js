import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  const user = jwt.verify(token, process.env.JWT_SECRET);
  if (!user) {
    return res
      .status(401)
      .send({ success: false, message: "Invalid authentication token" });
  }
  

  req.user = user;
  //   console.log(isvalid);
  next();
};
