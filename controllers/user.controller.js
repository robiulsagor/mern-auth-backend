import UserModel from "../models/user.model.js";

export const userData = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return res.json({
        status: false,
        message: "No user found with this data!",
      });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
};
