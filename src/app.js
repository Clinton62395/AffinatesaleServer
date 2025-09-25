import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import courseRoute from "./routes/course.route.js";
import referralRedirector from "./controllers/redirectUser.controller.js";
import scriptRouteter from "./routes/scrapt.route.js";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.VERCEL_URL],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// registration and login route

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// bank list route
app.use("/api", scriptRouteter);

// redirection to new link from backend localhost url
app.use("/register", referralRedirector);

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
