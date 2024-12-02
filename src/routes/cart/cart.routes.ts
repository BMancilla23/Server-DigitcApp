import { Router } from "express";
import { verifyToken } from "../../middlewares/authMiddleware";
import {
  applyCouponHandler,
  emptyCartHandler,
  getCartByUserHandler,
  updateCartHandler,
} from "./cart.controller";

const router = Router();

router.post("/cart", verifyToken, updateCartHandler);
router.get("/cart", verifyToken, getCartByUserHandler);
router.delete("/cart", verifyToken, emptyCartHandler);
router.post("/cart/apply-coupon", verifyToken, applyCouponHandler);
export default router;
