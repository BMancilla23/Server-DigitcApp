import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../enums/UserRole";

// Middleware para verificar el token JWT
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Access denied. No token provided",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as {
      id: string;
      role: string;
    };

    // Asignamos el userId y el rol a la request
    req.userId = decoded.id;
    req.role = decoded.role;

    next();
  } catch (error) {
    res.status(401).json({
      error: "Invalid token",
    });
  }
};

// Middleware para verificar roles con string
/* export const verifyRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({
        error: "Access denied. Insufficient permissions",
      });
      return;
    }
    next();
  };
}; */

// Middleware para verificar roles con enums
export const verifyRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.role;

    if (!userRole || !allowedRoles.includes(userRole as UserRole)) {
      res.status(403).json({
        error: "Access denied. Insufficient permissions",
      });
      return;
    }
    next();
  };
};
