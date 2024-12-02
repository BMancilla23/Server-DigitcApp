import { Router } from "express";
import { UserRole } from "../../enums/UserRole";
import { verifyRole, verifyToken } from "../../middlewares/authMiddleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { objectIdSchema } from "../../utils/validators";
import {
  blockUserHandler,
  createUserHandler,
  deleteUserHandler,
  forgotPasswordHandler,
  getUserHandler,
  getUsersHandler,
  getWishlistHandler,
  loginAdminHandler,
  loginUserHandler,
  logoutUserHandler,
  refreshTokenHandler,
  resetPasswordHandler,
  savedAddressHandler,
  unBlockUserHandler,
  updateUserHandler,
} from "./user.controller";
import {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
} from "./user.schema";

const router = Router();

router.post(
  "/auth/register",
  validateRequest({
    bodySchema: createUserSchema,
  }),
  createUserHandler
);

router.get("/users", getUsersHandler);

router.get("/users/refresh-token", refreshTokenHandler);

router.get("/users/logout", logoutUserHandler);

router.post("/users/forgot-password", forgotPasswordHandler);

router.put("/users/reset-password/:token", resetPasswordHandler);

router.get("/users/whishlist", verifyToken, getWishlistHandler);

router.post(
  "/auth/login",
  validateRequest({
    bodySchema: loginUserSchema,
  }),
  loginUserHandler
);

router.post(
  "/auth/admin/login",
  validateRequest({
    bodySchema: loginUserSchema,
  }),
  loginAdminHandler
);

router.put("/users/address", verifyToken, savedAddressHandler);

router.get(
  "/users/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  validateRequest({
    paramsSchema: objectIdSchema,
  }),
  getUserHandler
);

router.put(
  "/users/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  validateRequest({
    paramsSchema: objectIdSchema,
    bodySchema: updateUserSchema,
  }),
  updateUserHandler
);

router.delete(
  "/users/:id",
  validateRequest({
    paramsSchema: objectIdSchema,
  }),
  deleteUserHandler
);

router.put(
  "/users/block-user/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  validateRequest({
    paramsSchema: objectIdSchema,
  }),
  blockUserHandler
);

router.put(
  "/users/unblock-user/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  validateRequest({
    paramsSchema: objectIdSchema,
  }),
  unBlockUserHandler
);

export default router;
