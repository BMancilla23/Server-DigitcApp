import mongoose from "mongoose";
import { OrderStatus } from "../../enums/OrderStatus";

const orderSchema = new mongoose.Schema(
  {
    /* userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, */

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          /*   required: true, */
        },
        quantity: Number,
      },
    ],
    /* total: {
      type: Number,
      required: true,
    }, */
    paymentIntent: {},
    status: {
      type: String,
      /* enum: ["pending", "processing", "shipped", "delivered", "cancelled"], */
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      /*   required: true, */
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;
