import express from "express";
import { body } from "express-validator";
import { verifyToken, adminOnly } from "../middlewares/authMiddleware.js";
import {
  addPatient,
  deletePatient,
  getAllPatients,
  getPatient,
  updatePatient,
} from "../controllers/patientController.js";

import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
} from "../controllers/userController.js"

const router = express.Router();

const patientValidation = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name is required"),

  body("age")
    .isInt({ min: 1 })
    .withMessage("Age must be a positive integer")
    .notEmpty()
    .withMessage("Age is required"),

  body("gender")
    .isIn(["Male", "Female"])
    .withMessage("Gender must be 'Male' or 'Female'")
    .notEmpty()
    .withMessage("Gender is required"),

  body("phone")
    .isNumeric()
    .withMessage("Phone must be a number")
    .notEmpty()
    .withMessage("Phone number is required"),

  body("description")
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("Description is required"),
];

//Patient Routes
router.get("/patients", verifyToken, adminOnly, getAllPatients);

router.get("/patients/:id", verifyToken, adminOnly, getPatient);

router.post("/patients", verifyToken, adminOnly, patientValidation, addPatient);

router.put(
  "/patients/:id",
  verifyToken,
  adminOnly,
  patientValidation,
  updatePatient
);

router.delete("/patients/:id", verifyToken, adminOnly, deletePatient);

//User Routes
router.get("/users", verifyToken, adminOnly, getAllUsers);

router.get("/users/:id", verifyToken, adminOnly, getUser);

router.put("/users/:id", verifyToken, adminOnly, updateUser);

router.delete("/users/:id", verifyToken, adminOnly, deleteUser);

//Doctor Routes


export default router;