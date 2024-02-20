import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CustomError } from "../middlewares/error.js";

export const registerController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // check if user exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser)
      throw new CustomError("Username or email already exists!", 400);

    const salt = await bcrypt.genSalt(10);
    // encrypt the password
    const hashedPass = await bcrypt.hashSync(password, salt);

    // create new User
    const newUser = new User({ ...req.body, password: hashedPass });
    // push user to Mongo db
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const loginController = async (req, res, next) => {
  try {
    let user;
    const { email, username, password: loginPass } = req.body;

    if (email) {
      user = await User.findOne({ email: email });
    } else {
      user = await User.findOne({ username: username });
    }

    // console.log("login - USER: ", user);

    if (!user) throw new CustomError("User not found!", 404);

    // compare user's login password with database password
    const match = await bcrypt.compare(loginPass, user.password);

    if (!match) throw new CustomError("Wrong Credentials!", 401);

    // remove password from user object we are sending back
    // i.e. extract all data except password
    const { password, ...data } = user?._doc;

    // console.log("login - USER._doc: DATA: ", data);

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    res.cookie("token", token).status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    // clear the cookie
    res
      .clearCookie("token", { sameSite: "none", secure: true })
      .status(200)
      .json("User logged out successfully!");
  } catch (err) {
    next();
  }
};

export const refetchUserController = async (req, res, next) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, data) => {
    // console.log("data: ", data);
    if (err) throw new CustomError(err, 404);

    try {
      const id = data._id;
      const user = await User.findOne({ _id: id });
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  });
};
