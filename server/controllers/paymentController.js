import Razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
import crypto from "crypto";
dotenv.config();

const verifyRazorpaySignature = ({ orderID, paymentID, razorpaySignature }) => {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderID}|${paymentID}`)
    .digest("hex");

  return expectedSignature === razorpaySignature;
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  const { amount } = req.body;

  const options = {
    amount: amount * 100, // convert to paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const saveTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  const userID = req.user.id;
  const {
    orderID,
    paymentID,
    razorpaySignature,
    amount,
    currency,
    receipt,
    items,
  } = req.body;

  try {
    const isValid = verifyRazorpaySignature({
      orderID,
      paymentID,
      razorpaySignature,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const transaction = await transactionModel.create({
      userID,
      orderID,
      paymentID,
      amount,
      currency,
      receipt,
      items,
      status: "success",
    });

    return res.status(201).json({
      success: true,
      message: "Transaction verified and saved successfully",
      data: transaction,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error creating transaction",
      error: err.message,
    });
  }
};

const getTransactions = async (req, res) => {
  const userID = req.user.id;
  try {
    const transactions = await transactionModel
      .find({
        userID,
      })
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Transactions retrieved",
      data: transactions,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionModel.find({}).populate("userID");

    return res.status(200).json({
      success: true,
      message: "All transactions retrieved",
      data: transactions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error retrieving transactions",
      error: err.message,
    });
  }
};

export { createOrder, saveTransaction, getTransactions, getAllTransactions };
