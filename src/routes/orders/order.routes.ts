import { Router } from "express";
import { verifyToken } from "../../middlewares/authMiddleware";
import { createOrderHandler } from "./order.controller";

const router = Router();

router.post("/orders", verifyToken, createOrderHandler);

export default router;
