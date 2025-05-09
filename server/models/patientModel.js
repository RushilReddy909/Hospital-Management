import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
      max: 150,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
    },
    phone: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const patientModel = mongoose.model("patients", patientSchema);

export default patientModel;
