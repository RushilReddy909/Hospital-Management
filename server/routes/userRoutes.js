import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getUserInfo } from "../controllers/userController.js";

const router = express.Router();

router.get("/", verifyToken, getUserInfo);

router.get("/verify", verifyToken, async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Successfully verified Token",
  });
});

export default router;
