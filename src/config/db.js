import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
  console.log(process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("✅connection to mongo succesfully");
  } catch (error) {
    console.log("⛔error when connecting to mongodb", error.message);
    process.exit(1);
  }
};

export default connectDb;
