import { payment } from "../../services/mercadoPago.service";
import { AppError } from "../../utils/AppError";
import { ObjectIdInput } from "../../utils/validators";
import CartModel from "../cart/cart.model";
import UserModel from "../users/user.model";
import OrderModel from "./order.model";

export const createOrder = async (userId: ObjectIdInput) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const cart = await CartModel.findOne({
    orderBy: userId,
  }).populate("products.product");

  if (!cart || cart.products.length === 0) {
    throw new AppError("No products in cart to order", 400);
  }

  const { products, total } = cart;

  console.log(total);

  // Verificar que el total sea positivo antes de crear la orden
  if (total <= 0) {
    throw new AppError(
      "Invalid order total. The total amount must be positive.",
      400
    );
  }

  // Crear una nueva orden basada en los datos del carrito
  const newOrder = await OrderModel.create({
    orderBy: userId,
    products: products.map((item: any) => ({
      product: item.product._id,
      quantity: item.quantity,
    })),
    total,
    status: "pending",
  });

  // Crear el cuerpo de la solicitud de pago
  const body = {
    transaction_amount: total,
    description: "Compra en tu tienda de tecnología", // Descripción general del pedido
    payment_method_id: "visa",
    payer: {
      email: user?.email as string,
    },
  };

  /* console.log(body); */

  const requestOptions = {
    idempotencyKey: newOrder._id.toString(),
  };

  // Crear el pago en Mercado Pago
  const paymentIntent = await payment.create({
    body,
    requestOptions,
  });

  /* console.log(paymentIntent); */

  // Guardar el intento de pago en la orden
  newOrder.paymentIntent = paymentIntent;
  await newOrder.save();

  // Vaciar el carrito después de crear la orden
  await CartModel.findOneAndUpdate(
    { orderBy: userId },
    { products: [], subTotal: 0, total: 0 }
  );

  const paymentLink =
    paymentIntent.point_of_interaction?.transaction_data?.ticket_url ||
    paymentIntent.point_of_interaction?.transaction_data?.qr_code ||
    "";

  return {
    newOrder,
    paymentLink,
  };
};
