import { AppError } from "../../utils/AppError";
import { ObjectIdInput } from "../../utils/validators";
import CouponModel from "../coupons/coupon.model";
import ProductModel from "../products/product.model";
import UserModel from "../users/user.model";
import CartModel from "./cart.model";

export const updateCart = async (userId: ObjectIdInput, cart: any) => {
  // Verificar si el usuario existe

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Obtener los detalles de los productos en el carrito
  const productIds = cart.map((item: any) => item._id);
  console.log("Product IDs in cart:", productIds);

  const products = await ProductModel.find({
    _id: { $in: productIds },
  });

  // Construir la lista de productos en el carrito
  const cartItems = cart.map((item: any) => {
    const product = products.find((p) => p._id.equals(item._id));

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return {
      product: product._id,
      quantity: item.quantity,
    };
  });

  // Calcular subtotal usando los precios actuales de los productos
  const subTotal = cartItems.reduce((acc: number, item: any) => {
    const product = products.find((p) => p._id.equals(item.product));
    return acc + product!.price * item.quantity;
  }, 0);

  // Si no hay descuentos, el total es igual al subtotal
  const total = subTotal;

  // Crear o actualizar el carrito del usuario

  const updatedCart = await CartModel.findOneAndUpdate(
    {
      orderBy: user._id,
    },
    {
      products: cartItems,
      subTotal: subTotal,
      total: total,
    },
    {
      new: true,
      upsert: true,
    }
  );

  return updatedCart;

  // Example for api
  /*   {
      "cart": [
        {
          "_id": "672c6b3b714b2716845d0544", // product id
          "quantity": 5
        },
        {
          "_id": "672c6a6f714b2716845d0540",
          "quantity": 2
        }
      ]
    } */
};

export const getCartByUser = async (userId: ObjectIdInput) => {
  const cart = await CartModel.findOne({
    orderBy: userId,
  }).populate("products.product", "title price color ");

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  return cart;
};

export const emptyCart = async (userId: ObjectIdInput) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const cart = await CartModel.findOneAndDelete({ orderBy: userId });

  return cart;
};

export const applyCoupon = async (userId: ObjectIdInput, code: string) => {
  const coupon = await CouponModel.findOne({ code });

  if (coupon === null) {
    throw new AppError("Invalid coupon code", 400);
  }

  const cart = await CartModel.findOne({
    orderBy: userId,
  }).populate("products.product");

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const { subTotal } = cart;

  // Calcular el total con descuento aplicado
  const total = parseFloat(
    (subTotal - (subTotal * coupon.discount) / 100).toFixed(2)
  );

  await CartModel.findOneAndUpdate(
    {
      orderBy: userId,
    },
    { $set: { total } },
    { new: true }
  );

  return total;
};
