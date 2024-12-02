import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { createOrder } from "./order.service";

export const createOrderHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId!;

    const { newOrder, paymentLink } = await createOrder(userId);

    res.status(201).json({
      newOrder,
      paymentLink,
    });
    return;
  }
);
