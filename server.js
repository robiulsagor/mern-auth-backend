import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/mongodb.js";

import authRoute from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.json({ msg: "Route is working perfectly!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
