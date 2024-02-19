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

// LOGOUT

// FETCH CURRENT USER

export default router;
