import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { predictDisease } from "../controllers/predictController.js";

const router = express.Router();

router.post("/predict", verifyToken, predictDisease);

export default router;
