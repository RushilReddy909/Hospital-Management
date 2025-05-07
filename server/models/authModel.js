import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "patient",
      enum: ["patient", "doctor", "admin"],
    },
  },
  {
    timestamps: true,
  }
);

const authModel = mongoose.model("users", authSchema);

export default authModel;
