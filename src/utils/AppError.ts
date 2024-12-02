// src/utils/AppError.ts
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Ajuste para asegurar la extensión de Error en entornos ES6+
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
