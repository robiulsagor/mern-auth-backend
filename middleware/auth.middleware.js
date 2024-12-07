import jwt, { decode } from "jsonwebtoken";

export const checkAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "No token found!",
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    return res.status(400).json({
      success: false,
      message: "Invalid token!",
    });
  }
  req.body.userId = decoded.userId;

  next();
};
