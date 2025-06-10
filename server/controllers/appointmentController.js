import appointmentModel from "../models/appointmentModel.js";
import { validationResult } from "express-validator";

const createAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  const patientID = req.user.id;

  try {
    const exist = await appointmentModel.findOne({
      patientID,
      doctorID: req.body.doctorID,
    });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Appointment Already Exists",
      });
    }

    const appointment = new appointmentModel({
      patientID,
      ...req.body,
    });
    await appointment.save();

    return res.status(201).json({
      success: true,
      message: "Appointment Requested",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Appointment could not be created",
      error: err,
    });
  }
};

const updateAppointment = async (req, res) => {
  const doctorID = req.user._id;

  try {
    const appointment = await appointmentModel.findOneAndUpdate(
      doctorID,
      {
        status: req.body.status,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Appointment status updated",
      data: appointment,
    });
  } catch (err) {
    return res.status(500).json({
      success: true,
      message: "Server error updating",
      error: err,
    });
  }
};

const getAppointment = async (req, res) => {
  const patientID = req.user._id;

  try {
    const appointment = await appointmentModel.find({patientID});

    return res.status(200).json({
      success: true,
      message: "User appointments retrieved",
      data: appointment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching appointment",
      error: err,
    });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});

    return res.status(200).json({
      success: true,
      message: "All appointments retrieved",
      data: appointments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching appointments",
      error: err,
    });
  }
};

export {
  createAppointment,
  updateAppointment,
  getAppointment,
  getAllAppointments,
};
