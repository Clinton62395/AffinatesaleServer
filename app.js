import express from "express";
import dotenv from "dotenv";
import connectDb from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import courseRoute from "./src/routes/course.route.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// registration and login route

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// classroom rout
app.use("/classroom", courseRoute);

// bank details route

app.get("/", (req, res) => {
  res.send("welcom to afiliation site");
});

connectDb();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`♻SERVER IS RUNNING ON PORT ${PORT}♻`);
  console.log(`http//localhost:${PORT}`);
});
