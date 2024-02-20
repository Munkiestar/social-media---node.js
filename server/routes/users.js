import express from "express";

import { getUserController } from "../controllers/userController.js";

const router = express.Router();

// GET
router.get("/:userId", getUserController);

export default router;
