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

export const unFollowUserController = async (req, res, next) => {
  const { userId } = req.params;
  const { _id } = req.body;

  try {
    if (userId === _id)
      throw new CustomError("You can not unfollow yourself!", 500);

    const userToUnFollow = await User.findById(userId);
    const loggedInUser = await User.findById(_id);

    // console.log("userToUnFollow: ", userToUnFollow);
    // console.log("loggedInUser: ", loggedInUser);
    if (!userToUnFollow || !loggedInUser)
      throw new CustomError("User not found!", 404);

    if (!loggedInUser.following.includes(userId))
      throw new CustomError("Not following this user!", 400);

    loggedInUser.following = loggedInUser.following.filter(
      (id) => id.toString() !== userId,
    );
    userToUnFollow.followers = userToUnFollow.followers.filter(
      (id) => id.toString() !== _id,
    );

    // save both users
    await loggedInUser.save();
    await userToUnFollow.save();

    res.status(200).json({ message: "Successfully unfollowed user!" });
  } catch (err) {
    next(err);
  }
};

export const blockUserController = async (req, res, next) => {
  const { userId } = req.params;
  const { _id } = req.body;

  try {
    if (userId === _id) throw new CustomError("You can't block yourself!", 500);

    const userToBlock = await User.findById(userId);
    // logged in user
    const loggedUser = await User.findById(_id);

    if (!userToBlock || !loggedUser)
      throw new CustomError("User not found!", 404);

    if (loggedUser.blockList.includes(userId))
      throw new CustomError("This user is already blocked!", 400);

    // block user
    loggedUser.blockList.push(userId);

    // case if this user is following this 'to be' blocked user
    loggedUser.following = loggedUser.following.filter(
      (id) => id.toString() !== userId,
    );
    userToBlock.followers = userToBlock.followers.filter(
      (id) => id.toString() !== _id,
    );

    // save both users to db
    await loggedUser.save();
    await userToBlock.save();

    // send response
    res.status(200).json({ message: "Successfully blocked user!" });
  } catch (err) {
    next(err);
  }
};

export const unBlockUserController = async (req, res, next) => {
  const { userId } = req.params;
  const { _id } = req.body;

  try {
    if (userId === _id)
      throw new CustomError("You can't unblock yourself!", 500);

    const userToUnblock = await User.findById(userId);
    // logged in user
    const loggedUser = await User.findById(_id);

    if (!userToUnblock || !loggedUser)
      throw new CustomError("User not found!", 404);

    if (!loggedUser.blockList.includes(userId))
      throw new CustomError("This user is unblocked!", 400);

    //unblock user
    loggedUser.blockList = loggedUser.blockList.filter(
      (id) => id.toString() !== userId,
    );

    // save both users to db
    await loggedUser.save();

    // send response
    res.status(200).json({ message: "Successfully unblocked user!" });
  } catch (err) {
    next(err);
  }
};

export const getBlockedUsersController = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate(
      "blockList",
      "username fullName profilePicture",
    );

    if (!user) throw new CustomError("User not found!", 404);

    const blockedList = user.blockList;

    if (!blockedList.length) throw new CustomError("No users blocked!", 400);

    res.status(200).json(blockedList);
  } catch (err) {
    next(err);
  }
};
