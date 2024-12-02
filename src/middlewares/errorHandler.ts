import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Evita enviar más de una respuesta
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      // Asegúrate de devolver solo una respuesta
      message: "Validation Error",
      errors: err.errors.map((e) => ({ path: e.path, message: e.message })),
    });
    return; // Asegúrate de salir del middleware después de enviar la respuesta
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
    });
    return; // Asegúrate de salir del middleware después de enviar la respuesta
  }

  if (err instanceof Error) {
    res.status(500).json({
      message: "An unexpected error occurred",
      ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
    });
    return; // Asegúrate de salir del middleware después de enviar la respuesta
  }

  // Manejo de errores desconocidos, solo se envía si no se ha enviado nada antes
  res.status(500).json({
    message: "An unknown error occurred",
    ...(process.env.NODE_ENV === "development" ? { error: err } : {}),
  });
};

export default errorHandler;
