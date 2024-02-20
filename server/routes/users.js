import express from "express";

import {
  getUserController,
  updateUserController,
  followUserController,
  unFollowUserController,
} from "../controllers/userController.js";

const router = express.Router();

// GET
router.get("/:userId", getUserController);

// UPDATE
router.put("/update/:userId", updateUserController);

// FOLLOW USER
router.post("/follow/:userId", followUserController);

// UNFOLLOW USER
router.post("/unfollow/:userId", unFollowUserController);

export default router;
