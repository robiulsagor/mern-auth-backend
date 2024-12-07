import bcrypt from "bcryptjs";

import UserModel from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import sendMsg from "../config/sendGrid.js";

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
    const token = generateToken(user);

    const emailCon = {
      email,
      subject: "Welcome to MERN - AUTH!",
      text: `Welcome to MERN AUTH, ${name}! Your account is created with this email; Thanks for being with us!`,
      html: `<div
      style="
        border: 1px solid rgb(9, 57, 120);
        width: 400px;
        margin: 0 auto;
        padding: 10px 20px;
        border-radius: 10px;
      "
    >
      <h2 style="text-align: center">Hi User!</h2>
      <p style="font-size: 20px; margin-top: 40px; text-align: justify">
        Welcome to <i><b> MERN AUTH</b></i
        >. This is a simple authentication system using MERN STACK. Thank you
        for be with us.
      </p>
    </div>`,
    };

    await sendMsg(emailCon);

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ user, token });
  } catch (error) {
    console.log(error);

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

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        message: "User pass error!",
      });
    }

    const token = generateToken(user);
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

export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return res.json({
        status: false,
        message: "No user found with this data!",
      });
    }

    if (user.isAccountVerified) {
      return res.json({ status: false, message: "Already verified!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const emailCon = {
      email: user.email,
      subject: "Email verification",
      text: `Welcome to MERN AUTH! Your account is created with this email; Thanks for being with us!`,
      html: `
      <!DOCTYPE html>
<html>
  <head>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
    </style>

    
  </head>
  <body style="font-family: 'Poppins', sans-serif; font-weight: 400">
    <div
      style="
        border: 1px solid rgb(9, 57, 120);
        width: 400px;
        margin: 0 auto;
        padding: 10px 20px;
        border-radius: 10px;
        font-family: 'Poppins', sans-serif;
        font-weight: 400;
      "
    >
      <h2>Hi ${user.name}!</h2>
      <p style="font-size: 18px; margin-top: 20px; text-align: justify ; font-family: 'Poppins', sans-serif; font-weight: 400">
        Welcome to <i><b> MERN AUTH</b></i
        >. To verify your email, Please enter the following code:
      </p>
      <p
        style="
          background-color: rgb(26, 160, 100);
          color: #fff;
          padding: 20px;
          border-radius: 10px;
          font-size: 28px;
          text-align: center;
          font-weight: bold;
          letter-spacing: 5px;
        "
      >
        ${otp}
      </p>

      <p style="font-size: 16px; margin-top: 40px">
        Thank you for being with us.
      </p>

      <p style="font-size: 16px; line-height: 25px">
        Best wishes, <br />
        MERN-AUTH Team
      </p>
    </div>
  </body>
</html>
`,
    };

    await sendMsg(emailCon);

    return res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!otp) {
      return res.json({
        status: false,
        message: "Missing OTP!",
      });
    }

    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return res.json({
        status: false,
        message: "No user found with this data!",
      });
    }

    if (user.isAccountVerified) {
      return res.json({ status: false, message: "Already verified!" });
    }

    if (user.verifyOtpExpiresAt < Date.now()) {
      return res.json({
        status: false,
        message: "Verification token expired!",
      });
    }

    if (otp !== user.verifyOtp) {
      return res.json({
        status: false,
        message: "OTP not matched!",
      });
    }

    user.verifyOtp = "";
    user.verifyOtpExpiresAt = 0;
    user.isAccountVerified = true;

    await user.save();

    res.json({
      success: true,
      message: "Email verified!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
};
