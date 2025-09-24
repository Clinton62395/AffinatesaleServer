import dotenv from "dotenv";
import express from "express";

dotenv.config();

const router = express.Router();

const FRONTEND_URL = process.env.FORM_URL;

router.get("/", (req, res) => {
  try {
    const referralCode = req.query.ref;

    if (!referralCode) {
      return res.status(400).send({ message: "referralCode is missing" });
    }

    const newRedirectLink = `${FRONTEND_URL}?ref=${referralCode}`;
    res.redirect(301, newRedirectLink);
  } catch (error) {
    console.error("error when redirection", error);

    return res.status(500).send({ message: "internal server error" });
  }
});
export default router;
