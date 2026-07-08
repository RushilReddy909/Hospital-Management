import appointmentModel from "../models/appointmentModel.js";
import { validationResult } from "express-validator";
import patientModel from "../models/patientModel.js";
import doctorModel from "../models/doctorModel.js";
import authModel from "../models/authModel.js";
import mongoose from "mongoose";

const createAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  const requesterUserId = req.user.id;
  const {
    doctorID: doctorDocId,
    patientID: patientUserIdFromBody,
    date,
    timeSlot,
  } = req.body;

  try {
    const effectivePatientUserId =
      req.user.role === "admin" ? patientUserIdFromBody : requesterUserId;

    if (!effectivePatientUserId) {
      return res.status(400).json({
        success: false,
        message: "patientID is required when booking as admin",
      });
    }

    if (!doctorDocId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    const pat = await patientModel.findOne({
      patientID: effectivePatientUserId,
    });
    if (!pat) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }
    const patientID = pat._id;

    const doctor = await doctorModel.findById(doctorDocId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message:
          "Doctor profile not found. The doctor may not have created their profile yet.",
      });
    }

    if (doctor.status === "Away") {
      return res.status(400).json({
        success: false,
        message: "Doctor is currently unavailable (Status: Away)",
      });
    }

    // Normalize the date to the start of the day so a slot is unique per calendar day
    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);

    // One booking per doctor per timeSlot per day
    const slotConflict = await appointmentModel.findOne({
      doctorID: doctor._id,
      date: appointmentDate,
      timeSlot,
    });
    if (slotConflict) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked for the doctor.",
      });
    }

    // Prevent the same patient booking this doctor twice on the same day
    const existingPatientBooking = await appointmentModel.findOne({
      patientID,
      doctorID: doctor._id,
      date: appointmentDate,
    });
    if (existingPatientBooking) {
      return res.status(409).json({
        success: false,
        message:
          "You already have an appointment with this doctor on this date.",
      });
    }

    await appointmentModel.create({
      patientID,
      doctorID: doctor._id,
      date: appointmentDate,
      timeSlot,
      status: "Pending",
      reason: req.body.reason,
    });

    return res.status(201).json({
      success: true,
      message: "Appointment successfully booked",
    });
  } catch (err) {
    // A duplicate-key error here means the unique index caught a real clash.
    // The index name is logged so you can spot a stale/incorrect index.
    if (err.code === 11000) {
      console.error("Duplicate key on appointment insert:", err.keyValue, err.message);
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked for the doctor.",
      });
    }

    console.error("Create appointment error:", err);
    return res.status(500).json({
      success: false,
      message: "Appointment could not be created due to a server error",
      error: err.message,
    });
  }
};

const updateAppointment = async (req, res) => {
  const { id: userId } = req.user;
  const { id: appointmentId } = req.params;

  // Fetch user from DB to get current role (in case it was updated after login)
  const user = await authModel.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  const role = user.role;

  if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid appointment ID",
    });
  }

  try {
    const update = { status: req.body.status };
    const filter = { _id: appointmentId };

    if (role === "doctor") {
      const doctor = await doctorModel.findOne({ doctorID: userId });
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor profile not found",
        });
      }
      filter.doctorID = doctor._id;
    } else if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const appointment = await appointmentModel.findOneAndUpdate(
      filter,
      update,
      {
        new: true,
      }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment status updated",
      data: appointment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error updating",
      error: err.message,
    });
  }
};

const getAppointment = async (req, res) => {
  const { id: userID } = req.user;
  const { id: appointmentId } = req.params;

  try {
    const role = req.user.role;

    let filter = {};

    if (role === "admin") {
      if (appointmentId && mongoose.Types.ObjectId.isValid(appointmentId)) {
        filter._id = appointmentId;
      }
    } else if (role === "doctor") {
      const doctor = await doctorModel
        .findOne({ doctorID: userID })
        .select("_id")
        .lean();
      if (!doctor)
        return res.status(404).json({
          success: false,
          message: "Doctor not found",
        });
      filter.doctorID = doctor._id;
      if (appointmentId && mongoose.Types.ObjectId.isValid(appointmentId)) {
        filter._id = appointmentId;
      }
    } else if (role === "patient") {
      const patient = await patientModel
        .findOne({ patientID: userID })
        .select("_id")
        .lean();
      if (!patient)
        return res.status(404).json({
          success: false,
          message: "Patient not found",
        });
      filter.patientID = patient._id;
      if (appointmentId && mongoose.Types.ObjectId.isValid(appointmentId)) {
        filter._id = appointmentId;
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized role",
      });
    }

    const appointments = await appointmentModel
      .find(filter)
      .populate("doctorID")
      .populate("patientID");

    return res.status(200).json({
      success: true,
      message: "Appointments retrieved successfully",
      data: appointments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching appointments",
      error: err.message,
    });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({})
      .populate("patientID")
      .populate("doctorID");

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
