import mongoose from "mongoose";

const payment_schema = new mongoose.Schema({
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
});

const Payment = await mongoose.model("Payment", payment_schema);

export { Payment };
