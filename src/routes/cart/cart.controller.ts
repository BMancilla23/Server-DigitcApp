import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  applyCoupon,
  emptyCart,
  getCartByUser,
  updateCart,
} from "./cart.service";

export const updateCartHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { cart } = req.body;
    console.log(cart);

    const userId = req.userId!;

    const updatedCart = await updateCart(userId, cart);

    res.status(200).json(updatedCart);
    return;
  }
);

export const getCartByUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId!;

    const cart = await getCartByUser(userId);

    res.status(200).json(cart);
    return;
  }
);

export const emptyCartHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId!;

    const cart = await emptyCart(userId);

    res.status(200).json(cart);
    return;
  }
);

export const applyCouponHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId!;
    const { code } = req.body;
    const total = await applyCoupon(userId, code);

    res.status(200).json(total);
    return;
  }
);
