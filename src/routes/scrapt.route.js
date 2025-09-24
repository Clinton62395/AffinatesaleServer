import scrapeBanks from "../scripts/banks.script.js";
import express from "express";
const router = express.Router();

router.get("/scrape-banks", async (req, res) => {
  try {
    const banks = await scrapeBanks();
    res.status(200).json({ success: true, data: banks });
  } catch (error) {
    console.error("Error scraping banks:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});
export default router;
