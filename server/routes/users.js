import express from "express";

import {
  getUserController,
  updateUserController,
  followUserController,
  unFollowUserController,
  blockUserController,
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

// BLOCK USER
router.post("/block/:userId", blockUserController);

// UNBLOCK USER
export default router;
