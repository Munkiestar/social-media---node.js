import express from "express";

import {
  registerController,
  loginController,
  refetchUserController,
  logoutController,
} from "../controllers/authController.js";

const router = express.Router();

// REGISTER
router.post("/register", registerController);

// LOGIN
router.post("/login", loginController);

// LOGOUT
router.get("/logout", logoutController);

// FETCH CURRENT USER
router.get("/refetch", refetchUserController);

export default router;
