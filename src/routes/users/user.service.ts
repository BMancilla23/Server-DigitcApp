import argon2 from "argon2";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import generateToken from "../../config/jwtToken";
import generateRefreshToken from "../../config/refreshToken";
import { sendEmail } from "../../services/nodemailer.service";
import { AppError } from "../../utils/AppError";
import UserModel from "./user.model";
import {
  CreateUserInput,
  LoginUserInput,
  UpdateUserInput,
} from "./user.schema";
import { ObjectIdInput } from "../../utils/validators";
import CartModel from "../cart/cart.model";
import ProductModel from "../products/product.model";
/* import jwt from "jsonwebtoken"; */

// Función para hashear la contraseña
const hashPassword = async (password: string): Promise<string> => {
  return await argon2.hash(password);
};

export const createUser = async (userInput: CreateUserInput) => {
  /* const existingUser = await UserModel.findOne({
    email: userInput.email,
  });

  if (existingUser) {
    throw new Error("Email already exists");
  } */

  const existingUser = await UserModel.findOne({
    $or: [{ email: userInput.email }, { mobile: userInput.mobile }],
  });

  if (existingUser) {
    if (existingUser.email === userInput.email) {
      throw new AppError("Email already exists", 400);
    }
    if (existingUser.mobile === userInput.mobile) {
      throw new AppError("Mobile number already exists", 400);
    }
  }

  // Hashear la contraseña
  const hashedPassword = await hashPassword(userInput.password);

  const user = new UserModel({
    ...userInput,
    password: hashedPassword,
  });

  return await user.save();
};

export const loginUser = async (loginInput: LoginUserInput) => {
  const user = await UserModel.findOne({
    email: loginInput.email,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }
  const isPasswordValid = await argon2.verify(
    user.password as string,
    loginInput.password
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  /*   const SECRET_KEY = process.env.SECRET_KEY as string;

  const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
    expiresIn: "1h",
  }); */

  const token = generateToken(user._id.toString(), user.role as string);

  const refreshToken = generateRefreshToken(
    user._id.toString(),
    user.role as string
  );

  /*  const updatedUser = await UserModel.findByIdAndUpdate(
    user._id,
    {
      refreshToken,
    },
    {
      new: true,
    }
  ); */

  return {
    token,
    refreshToken,
    /* updatedUser, */
    user,
  };
};

export const updateUserById = async (
  userId: string,
  updatedUser: UpdateUserInput
) => {
  const user = await UserModel.findByIdAndUpdate(userId, updatedUser, {
    new: true,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const getAllUser = async () => {
  const users = await UserModel.find();
  return users;
};

export const getUserById = async (userId: string) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const deleteUserById = async (userId: string) => {
  const user = await UserModel.findByIdAndDelete(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }
};

export const blockUser = async (userId: string) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { isBlocked: true },
    {
      new: true,
    }
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const unBlockUser = async (userId: string) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { isBlocked: false },
    {
      new: true,
    }
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

interface DecodedToken {
  id: string;
  role: string;
}

export const refreshTokenService = async (refreshToken: string) => {
  /*  // Verificamos que exista el usuario con este refreshToken en la base de datos
  const user = await UserModel.findOne({ refreshToken });

  if (!user) {
    throw new AppError("No refresh token present in DB or does not match", 401);
  } */

  // Verificación del token directamente
  const decoded = jwt.verify(
    refreshToken,
    process.env.SECRET_KEY as string
  ) as DecodedToken;

  /* if (user.id !== decoded.id) {
    throw new AppError("Invalid refresh token for this user", 401);
  } */

  // Generación de nuevo token
  /* const accessToken = generateToken(user._id.toString(), user.role as string); */
  const accessToken = generateToken(decoded.id, decoded.role);
  return accessToken;
};

export const logoutUser = async (refreshToken: string) => {
  const user = await UserModel.findOneAndUpdate(
    { refreshToken },
    { refreshToken: "" },
    {
      new: true,
    }
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

/* export const resetPassword = async (
  userId: ObjectIdInput,
  password: string
) => {
  // Hashear la nueva contraseña
  const hashedPassword = await argon2.hash(password);

  // Actualizar la fecha de cambio de contraseña
  const passwordChangeAt = new Date();

  const user = await UserModel.findByIdAndUpdate(
    userId,
    {
      password: hashedPassword,
      passwordChangeAt,
    },
    {
      new: true,
    }
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}; */

export const sendPasswordResetEmail = async (email: string) => {
  const user = await UserModel.findOne({
    email,
  });

  if (!user) {
    throw new AppError("User with this email does not exist", 404);
  }

  // Generar un token re restablecimiento
  const resetToken = crypto.randomBytes(32).toString("hex");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const passwordResetTokenExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

  // Asignar el token hasheado y la expiración
  user.passwordResetToken = passwordResetToken;
  user.passwordResetTokenExpiration = passwordResetTokenExpiration;
  await user.save();

  const FRONTEND_URL =
    process.env.FRONTEND_URL ||
    `http://localhost:${process.env.PORT || 3000}/api/users`;

  // Crear un enlace de restablecimiento de contraseña
  const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;

  // Enviar el email con el enlace de restablecimiento de contraseña
  await sendEmail(
    email,
    "Forgot Password Link",
    "Hey user",
    `Click on the link below to reset your password. This link is valid for 10 minutes from now: <a href="${resetUrl}">Click Aquí</a>`
  );
};

export const resetPassword = async (token: string, newPassword: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  /*  console.log("Hashed token:", hashedToken); */

  const currentDate = new Date();
  /*  console.log("Current date:", currentDate); */

  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiration: { $gt: currentDate },
  });

  if (!user) {
    console.error("Token inválido: usuario no encontrado");
    throw new AppError("Token inválido", 401);
  }

  /* // Comprobar si el token expiró
  if (
    user.passwordResetTokenExpiration &&
    user.passwordResetTokenExpiration <= currentDate
  ) {
    console.error("Token expired.");
    throw new AppError("Token expired, Please try again later", 401);
  } */

  const hashedPassword = await argon2.hash(newPassword);

  // Actualizar la contraseña y limpiar los campos de token
  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiration = undefined;

  await user.save();

  return user;
};

export const getWishlist = async (userId: ObjectIdInput) => {
  const whishlist = await UserModel.findById(userId).populate("wishlist");
  if (!whishlist) {
    throw new AppError("User not found", 404);
  }

  return whishlist;
};

export const saveAddress = async (userId: ObjectIdInput, address: string) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    {
      address: address,
    },
    {
      new: true,
    }
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};
