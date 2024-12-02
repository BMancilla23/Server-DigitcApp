import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  CreateUserInput,
  LoginUserInput,
  UpdateUserInput,
} from "./user.schema";

import { UserRole } from "../../enums/UserRole";
import logger from "../../utils/logger";
import { ObjectIdRequest } from "../../utils/validators";
import {
  blockUser,
  createUser,
  deleteUserById,
  getAllUser,
  getUserById,
  getWishlist,
  loginUser,
  logoutUser,
  refreshTokenService,
  resetPassword,
  saveAddress,
  sendPasswordResetEmail,
  unBlockUser,
  updateUserById,
} from "./user.service";

export const createUserHandler = asyncHandler(
  async (req: Request<{}, CreateUserInput>, res: Response) => {
    const user = await createUser(req.body);

    res.status(201).json(user);
    return;
  }
);

export const loginUserHandler = asyncHandler(
  async (req: Request<{}, LoginUserInput>, res: Response) => {
    const { user, token, refreshToken } = await loginUser(req.body);

    // Configura el `refreshToken` como cookie segura y HTTP-only
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      user,
      token,
    });
    return;
  }
);

export const loginAdminHandler = asyncHandler(
  async (req: Request<{}, LoginUserInput>, res: Response) => {
    const { user, token, refreshToken } = await loginUser(req.body);

    if (user.role !== UserRole.ADMIN) {
      res.status(403).json({
        message: "Access denied. Admins only.",
      });
      return;
    }

    // Configura el `refreshToken` como cookie segura y HTTP-only
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      user,
      token,
    });
    return;
  }
);

export const refreshTokenHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    logger.info(refreshToken);

    if (!refreshToken) {
      res.status(401).json({
        error: "No refresh token in cookies",
      });
      return;
    }

    const accessToken = await refreshTokenService(refreshToken);
    res.status(200).json({
      accessToken,
    });
    return;
  }
);

export const logoutUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    await logoutUser(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.status(204).json({
      message: "User logged out successfully",
    });
    return;
  }
);

export const getUsersHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const users = await getAllUser();

    res.status(200).json(users);
    return;
  }
);

export const getUserHandler = asyncHandler(
  async (req: Request<ObjectIdRequest>, res: Response) => {
    const { id } = req.params;

    // Envolviendo id en un objeto para coincidir con ObjectIdInput
    const user = await getUserById(id);

    res.status(200).json(user);
    return;
  }
);

export const updateUserHandler = asyncHandler(
  async (req: Request<ObjectIdRequest, UpdateUserInput>, res: Response) => {
    /*   const { id } = req.params; */
    /*   console.log(req.userId); */
    const userId = req.userId!;

    const user = await updateUserById(userId, req.body);

    res.status(200).json(user);
    return;
  }
);

export const deleteUserHandler = asyncHandler(
  async (req: Request<ObjectIdRequest>, res: Response) => {
    const { id } = req.params;

    await deleteUserById(id);

    res.status(204).json();

    return;
  }
);

export const blockUserHandler = asyncHandler(
  async (req: Request<ObjectIdRequest>, res: Response) => {
    const { id } = req.params;

    const user = await blockUser(id);

    res.status(200).json(user);

    return;
  }
);

export const unBlockUserHandler = asyncHandler(
  async (req: Request<ObjectIdRequest>, res: Response) => {
    const { id } = req.params;

    const user = await unBlockUser(id);

    res.status(200).json(user);

    return;
  }
);

export const forgotPasswordHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    await sendPasswordResetEmail(email);

    res.status(200).json({ message: "Password reset email send" });

    return;
  }
);

export const resetPasswordHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { password } = req.body;
    const { token } = req.params;

    const user = await resetPassword(token, password);

    res.status(200).json(user);
  }
);
/* export const resetPasswordHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId!;
    const { password } = req.body;

    const user = await resetPassword(userId, password);

    res.status(200).json(user);
  }
); */

export const getWishlistHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId!;

    const whishlist = await getWishlist(userId);

    res.status(200).json(whishlist);

    return;
  }
);

export const savedAddressHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId!;
    const { address } = req.body;

    const updatedUser = await saveAddress(userId, address);

    res.status(200).json(updatedUser);
    return;
  }
);
