import User from "../models/User.js";
import { CustomError } from "../middlewares/error.js";

export const getUserController = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) throw new CustomError("User not found!", 404);

    const { password, ...data } = user?._doc;

    // return just users data
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const updateUserController = async (req, res, next) => {
  const { userId } = req.params;
  const updateData = req.body;

  try {
    const userToUpdate = await User.findById(userId);

    if (!userToUpdate) throw new CustomError("User not found!", 404);

    // update user with new values
    Object.assign(userToUpdate, updateData);

    // save updated user to DB
    await userToUpdate.save();

    res
      .status(200)
      .json({ message: "User updated successfully!", user: userToUpdate });
  } catch (err) {
    next(err);
  }
};
