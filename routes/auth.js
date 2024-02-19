import express from "express";
import bcrypt from "bcrypt";

import User from "../models/User.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if user exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser)
      return res.status(400).json("Username or email already exists!");

    const salt = await bcrypt.genSalt(10);
    // encrypt the password
    const hashedPass = await bcrypt.hashSync(password, salt);

    // create new User
    const newUser = new User({ ...req.body, password: hashedPass });
    // push user to Mongo db
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    let user;
    const { email, username, password } = req.body;

    if (email) {
      user = await User.findOne({ email: email });
    } else {
      user = await User.findOne({ username: username });
    }

    console.log("login - USER: ", user);

    if (!user) return res.status(404).json("User not found");

    // compare user's login password with database password
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json("Wrong Credentials!");

    res.status(200).json("Logged in successfully!");
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGOUT

// FETCH CURRENT USER

export default router;
