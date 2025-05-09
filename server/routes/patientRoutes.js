import express from "express";
import {
  addPatient,
  getAllPatients,
  getPatient,
  updatePatient,
  deletePatient,
  createSelfPatient,
  getSelfPatient,
  updateSelfPatient
} from "../controllers/patientController.js";
import { verifyToken, adminOnly } from "../controllers/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

const validation = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name is required"),

  body("age")
    .isInt({ min: 0 })
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

//User Routes
router.post("/self", verifyToken, validation, createSelfPatient);

router.get("/self", verifyToken, getSelfPatient);

router.put("/self", verifyToken, validation, updateSelfPatient);

//Admin Routes
router.post("/", verifyToken, adminOnly, validation, addPatient);

router.get("/", verifyToken, adminOnly, getAllPatients);

router.get("/:id", verifyToken, adminOnly, getPatient);

router.put("/:id", verifyToken, adminOnly, validation, updatePatient);

router.delete("/:id", verifyToken, adminOnly, deletePatient);

export default router;
