import { Router } from "express";
import {
  createCouponHandler,
  deleteCouponHandler,
  getCouponsHandler,
  updateCouponHandler,
} from "./coupon.controller";
import { verifyRole, verifyToken } from "../../middlewares/authMiddleware";
import { UserRole } from "../../enums/UserRole";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCouponSchema } from "./coupon.schema";
import { objectIdSchema } from "../../utils/validators";

const router = Router();

router.post(
  "/coupons",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  validateRequest({
    bodySchema: createCouponSchema,
  }),
  createCouponHandler
);

router.get(
  "/coupons",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  getCouponsHandler
);

router.put(
  "/coupons/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  validateRequest({
    paramsSchema: objectIdSchema,
    bodySchema: createCouponSchema,
  }),
  updateCouponHandler
);

router.delete(
  "/coupons/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  validateRequest({
    paramsSchema: objectIdSchema,
  }),
  deleteCouponHandler
);

export default router;
