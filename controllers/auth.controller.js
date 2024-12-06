import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModel from "../models/user.model.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already used",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({ name, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ user, token }); // return a response with the user data
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }

    console.log(user.password);

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        message: "User pass error!",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ success: true, user, token });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Unable to login",
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out",
  });
};
