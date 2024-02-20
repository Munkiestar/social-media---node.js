import express from "express";

import {
  getUserController,
  updateUserController,
} from "../controllers/userController.js";

const router = express.Router();

// GET
router.get("/:userId", getUserController);

// UPDATE
router.put("/update/:userId", updateUserController);

export default router;
