import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export const verifyToken = async (req, res, next) => {
  const headersToken = req.headers.authorization;
  if (!headersToken || !headersToken.startsWith("Bearer ")) {
    return res
      .status(400)
      .send({ success: false, message: "token is missing" });
  }

  const token = headersToken.split(" ")[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    req.user = user;
    //   console.log(isvalid);
    next();
  } catch (err) {
    console.error("error when signing jwt token");

    return res
      .status(401)
      .send({ success: false, message: "Invalid authentication token" });
  }
};
