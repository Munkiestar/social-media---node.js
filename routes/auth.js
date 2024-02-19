import express from "express";
import User from "../models/User.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    console.log("req body: ", req.body);
    const newUser = new User(req.body);
    //
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
