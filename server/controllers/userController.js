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

export const followUserController = async (req, res, next) => {
  const { userId } = req.params;
  const { _id } = req.body;

  try {
    if (userId === _id)
      throw new CustomError("You can not follow yourself!", 500);

    const userToFollow = await User.findById(userId);
    const loggedInUser = await User.findById(_id);

    // console.log("userToFollow: ", userToFollow);
    // console.log("loggedInUser: ", loggedInUser);
    if (!userToFollow || !loggedInUser)
      throw new CustomError("User not found!", 404);

    if (loggedInUser.following.includes(userId))
      throw new CustomError("Already following this user!", 400);

    loggedInUser.following.push(userId);
    userToFollow.followers.push(_id);

    // save both users
    await loggedInUser.save();
    await userToFollow.save();

    res.status(200).json({ message: "Successfully following user!" });
  } catch (err) {
    next(err);
  }
};
