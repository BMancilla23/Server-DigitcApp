import { Types } from "mongoose";
import { AppError } from "../../utils/AppError";
import { ObjectIdInput } from "../../utils/validators";
import UserModel from "../users/user.model";
import ProductModel from "./product.model";
import {
  CreateProductInput,
  ProductsQueryInput,
  RatingInput,
  UpdateProductInput,
} from "./product.schema";
import { processAndUploadImages } from "../../services/cloudinary.service";

export const createProduct = async (productInput: CreateProductInput) => {
  const product = await ProductModel.create(productInput);

  return product;
};

export const getProducts = async (queryParams: ProductsQueryInput) => {
  const { page = 1, limit = 10, sort, fields, ...filters } = queryParams;

  // Filtro avanzado (gt, gte, lt, lte) | // price[gte]=7000
  let queryStr = JSON.stringify(filters);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  const filterCriteria = JSON.parse(queryStr);

  let query = ProductModel.find(filterCriteria);

  // Ordenacion | // sort=category,brand
  if (sort) {
    const sortBy = sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Selección de campos
  if (fields) {
    const fieldsSelection = fields.split(",").join(" ");
    query = query.select(fieldsSelection);
  } else {
    query = query.select("-__v");
  }

  // Paginación | // page=1&limit=3
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  const productCount = await ProductModel.countDocuments(filterCriteria);
  const totalPages = Math.ceil(productCount / limit);

  /* if (skip >= productCount) {
    throw new AppError("This Page does not exists");
  } */

  /*   if (skip >= productCount && productCount > 0) {
      throw new AppError("This Page does not exists");
    } */

  const products = await query;

  return {
    totalDocuments: productCount,
    /*  products, */
    products: products.length > 0 ? products : [],
    /*  currentPage: page, */
    /* totalPages: Math.ceil(productCount / limit), */
    currentPage: Math.min(page, totalPages),
    totalPages,
  };
};

export const getProductById = async (productId: ObjectIdInput) => {
  const product = await ProductModel.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

export const updateProduct = async (
  productId: ObjectIdInput,
  productInput: UpdateProductInput
) => {
  const product = await ProductModel.findByIdAndUpdate(
    productId,
    productInput,
    {
      new: true,
    }
  );

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

export const deleteProductById = async (productId: ObjectIdInput) => {
  const product = await ProductModel.findByIdAndDelete(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }
};

export const addToWishList = async (productId: string, userId: string) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isInWishlist = user.wishlist.some(
    (id) => id.toString() === productId.toString()
  );

  const updateOperation = isInWishlist
    ? { $pull: { wishlist: productId } }
    : { $push: { wishlist: productId } };

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    updateOperation,
    {
      new: true,
    }
  );

  if (!updatedUser) {
    throw new AppError("Failed to update wishlist", 500);
  }

  return updatedUser;
};

export const ratingService = async (
  userId: string,
  productId: string,
  star: RatingInput,
  comment: string
) => {
  console.log("Rating service started for product:", productId);

  // Busca el producto
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const userObjectId = new Types.ObjectId(userId);

  // Encuentra si el usuario ya ha calificado el producto
  const alreadyRatedIndex = product.ratings.findIndex((rating) =>
    rating.postedBy!.equals(userObjectId)
  );
  console.log("Already rated index:", alreadyRatedIndex);

  let updatedProduct;

  if (alreadyRatedIndex >= 0) {
    // Actualiza la calificación existente
    /*    console.log("Updating existing rating..."); */
    updatedProduct = await ProductModel.findOneAndUpdate(
      {
        _id: productId,
        "ratings.postedBy": userObjectId,
      },
      {
        $set: { "ratings.$.star": star, "ratings.$.comment": comment },
      },
      {
        new: true,
      }
    );
  } else {
    // Añade una nueva calificación
    /*   console.log("Adding new rating..."); */
    updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        $push: { ratings: { star, comment: comment, postedBy: userObjectId } },
      },
      {
        new: true,
      }
    );
  }

  if (!updatedProduct) {
    throw new AppError("Failed to update ratings", 500);
  }

  // Calcule la nueva calificación promedio
  const totalRatings = updatedProduct.ratings.length;
  console.log("Total ratings after update:", totalRatings);

  const ratingSum = updatedProduct.ratings.reduce(
    (acc, rating) => acc + rating.star!,
    0
  );
  /*   console.log("Total sum of ratings:", ratingSum); */

  const averageRating = Math.round(ratingSum / totalRatings);
  /*   console.log("Calculated average rating:", averageRating); */

  // Actualiza el totalrating
  updatedProduct.totalrating = averageRating;
  console.log("Updated total rating:", updatedProduct.totalrating);

  // Guarda el producto actualizado
  await updatedProduct.save();
  console.log("Product updated successfully.");

  return updatedProduct;
};

export const uploadImagesForProduct = async (
  id: ObjectIdInput,
  files: Express.Multer.File[]
) => {
  if (files.length === 0) {
    throw new AppError("no images provided", 400);
  }

  // Procesa y sube las imágenes a Cloudinary
  const imageUrls = await processAndUploadImages(files, `products/${id}`);

  // Actualiza el producto con la lista de URLs de imágenes
  const updatedProduct = await ProductModel.findByIdAndUpdate(
    id,
    { images: imageUrls },
    { new: true }
  );

  if (!updatedProduct) {
    throw new AppError("Product not found", 404);
  }

  return updatedProduct;
};
