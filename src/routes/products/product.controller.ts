import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import { ObjectIdRequest } from "../../utils/validators";
import {
  CreateProductInput,
  ObjectProductIdInput,
  ProductsQueryInput,
  RatingInput,
  UpdateProductInput,
} from "./product.schema";
import {
  addToWishList,
  createProduct,
  deleteProductById,
  getProductById,
  getProducts,
  ratingService,
  updateProduct,
  uploadImagesForProduct,
} from "./product.service";
import ProductModel from "./product.model";
import { processAndUploadImages } from "../../services/cloudinary.service";

export const createProductHandler = asyncHandler(
  async (req: Request<{}, CreateProductInput>, res: Response) => {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const product = await createProduct(req.body);

    res.status(201).json(product);
    return;
  }
);

export const updateProductHandler = asyncHandler(
  async (req: Request<ObjectIdRequest, UpdateProductInput>, res: Response) => {
    const { id } = req.params;

    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    const product = await updateProduct(id, req.body);

    res.status(200).json(product);
    return;
  }
);

export const getProductsHandler = asyncHandler(
  async (req: Request<{}, {}, ProductsQueryInput>, res: Response) => {
    const { totalDocuments, products, currentPage, totalPages } =
      await getProducts(req.query);

    res.status(200).json({
      totalDocuments,
      currentPage,
      totalPages,
      products,
    });
    return;
  }
);

export const getProductHandler = asyncHandler(
  async (req: Request<ObjectIdRequest>, res: Response) => {
    const { id } = req.params;
    const product = await getProductById(id);

    res.status(200).json(product);
    return;
  }
);

export const deleteProductHandler = asyncHandler(
  async (req: Request<ObjectIdRequest>, res: Response) => {
    const { id } = req.params;
    await deleteProductById(id);

    res.status(204).json();

    return;
  }
);

export const addToWishListHandler = asyncHandler(
  async (req: Request<ObjectProductIdInput>, res: Response) => {
    const userId = req.userId;
    const { productId } = req.params;

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const updatedUser = await addToWishList(productId, userId);

    res.status(200).json(updatedUser);
    return;
  }
);

export const ratingHandler = asyncHandler(
  async (req: Request<ObjectProductIdInput, RatingInput>, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const { productId } = req.params;

    const { star, comment } = req.body;

    const updatedProduct = await ratingService(
      userId,
      productId,
      star,
      comment
    );

    res.status(200).json(updatedProduct);
    return;
  }
);

export const uploadImagesHandler = asyncHandler(
  async (req: Request<ObjectIdRequest>, res: Response) => {
    /* console.log(req.files); */
    const { id } = req.params;
    // Normaliza el archivo o archivos a un array de Express.Multer.File[]
    const files: Express.Multer.File[] = Array.isArray(req.files)
      ? req.files
      : req.file
      ? [req.file]
      : [];

    const updatedProduct = await uploadImagesForProduct(id, files);

    res.status(200).json({
      message: "Images uploaded successfully",
      data: updatedProduct,
    });

    return;
  }
);
