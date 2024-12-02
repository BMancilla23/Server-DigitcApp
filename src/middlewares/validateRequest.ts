import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

// Definición de una interfaz extendida de Request que incluye los datos validados
interface ValidatedRequest<TBody = unknown, TParams = unknown, TQuery = unknown>
  extends Request {
  validatedData?: {
    body?: TBody;
    params?: TParams;
    query?: TQuery;
  };
}

// Middleware genérico para validar diferentes partes del request
export const validateRequest = <
  TBody = unknown,
  TParams = unknown,
  TQuery = unknown
>({
  bodySchema,
  paramsSchema,
  querySchema,
}: {
  bodySchema?: ZodSchema<TBody>;
  paramsSchema?: ZodSchema<TParams>;
  querySchema?: ZodSchema<TQuery>;
}) => {
  return async (
    req: ValidatedRequest<TBody, TParams, TQuery>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      req.validatedData = {
        body: bodySchema ? await bodySchema.parseAsync(req.body) : undefined,
        params: paramsSchema
          ? await paramsSchema.parseAsync(req.params)
          : undefined,
        query: querySchema
          ? await querySchema.parseAsync(req.query)
          : undefined,
      };

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));

        res.status(400).json({
          error: "Invalid data",
          details: errorMessages,
        });
      } else {
        // Manejo de errores internos no relacionados con Zod
        next(error);
      }
    }
  };
};
