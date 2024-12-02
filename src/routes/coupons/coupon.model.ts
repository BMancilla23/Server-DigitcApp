import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  /*   validFrom: {
    type: Date,
    required: true,
  },
  validTo: {
    type: Date,
    required: true,
  }, */
  expiry: {
    type: Date,
    required: true,
  },
});

const CouponModel = mongoose.model("Coupon", couponSchema);

export default CouponModel;
