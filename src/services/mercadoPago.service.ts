import { MercadoPagoConfig, Payment } from "mercadopago";

// Incializar el cliente de Mercado Pago
const MERCADOPAGO_ACCESS_TOKEN = process.env
  .MERCADOPAGO_ACCESS_TOKEN! as string;

const client = new MercadoPagoConfig({
  accessToken: MERCADOPAGO_ACCESS_TOKEN,
  options: {
    timeout: 5000,
    idempotencyKey: "abc",
  },
});

export const payment = new Payment(client);
