import User from "../models/User.js";
import { CustomError } from "../middlewares/error.js";

export const getUserController = async (req, res, next) => {
  const { userId } = req.params;
  console.log("userID: ", userId);

  try {
    const user = await User.findById(userId);

    if (!user) throw new CustomError("User not found!", 404);

    const { password, ...data } = user?._doc;

    console.log("USER -data: ", data);
    // return just users data
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
