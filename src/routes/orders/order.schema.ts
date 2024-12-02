import { z } from "zod";
import { objectIdValid } from "../../utils/validators";
import { OrderStatus } from "../../enums/OrderStatus";

const OrderProductsSchema = z.object({
  product: objectIdValid,
  quantity: z.number().positive(),
  color: z.string().optional(),
});

export const createOrderSchema = z
  .object({
    products: z.array(OrderProductsSchema).optional(),
    orderBy: z.array(objectIdValid).optional(),
    status: z.nativeEnum(OrderStatus),
  })
  .strict();

export const updateOrderSchema = createOrderSchema.partial();

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
