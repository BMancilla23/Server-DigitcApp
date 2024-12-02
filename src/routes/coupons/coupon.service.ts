import { AppError } from "../../utils/AppError";
import { ObjectIdInput } from "../../utils/validators";
import CouponModel from "./coupon.model";
import { CreateCouponInput, UpdateCouponInput } from "./coupon.schema";

export const createCoupon = async (couponInput: CreateCouponInput) => {
  const coupon = await CouponModel.create(couponInput);

  return coupon;
};

export const getAllCoupons = async () => {
  const coupons = await CouponModel.find();

  return coupons;
};

export const updateCoupon = async (
  couponId: ObjectIdInput,
  couponInput: UpdateCouponInput
) => {
  const updatedCoupon = await CouponModel.findByIdAndUpdate(
    couponId,
    couponInput,
    { new: true }
  );

  if (!updatedCoupon) {
    throw new AppError("Coupon not found", 404);
  }

  return updatedCoupon;
};

export const deleteCoupon = async (couponId: ObjectIdInput) => {
  const deletedCoupon = await CouponModel.findByIdAndDelete(couponId);

  if (!deletedCoupon) {
    throw new AppError("Coupon not found", 404);
  }

  return deletedCoupon;
};
