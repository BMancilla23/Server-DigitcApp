import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ObjectIdRequest } from "../../utils/validators";
import { CreateCouponInput, UpdateCouponInput } from "./coupon.schema";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  updateCoupon,
} from "./coupon.service";

export const createCouponHandler = asyncHandler(
  async (req: Request<{}, CreateCouponInput>, res: Response) => {
    const coupon = await createCoupon(req.body);

    res.status(201).json(coupon);

    return;
  }
);

export const getCouponsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const coupons = await getAllCoupons();

    res.status(200).json(coupons);

    return;
  }
);

export const updateCouponHandler = asyncHandler(
  async (req: Request<ObjectIdRequest, UpdateCouponInput>, res: Response) => {
    const { id } = req.params;
    const coupon = await updateCoupon(id, req.body);

    res.status(200).json(coupon);
    return;
  }
);

export const deleteCouponHandler = asyncHandler(
  async (req: Request<ObjectIdRequest>, res: Response) => {
    const { id } = req.params;
    await deleteCoupon(id);
    res.status(204).json();
    return;
  }
);
