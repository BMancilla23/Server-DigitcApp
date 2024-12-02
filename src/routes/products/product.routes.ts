import { Router } from "express";
import { UserRole } from "../../enums/UserRole";
import { verifyRole, verifyToken } from "../../middlewares/authMiddleware";
import { uploadImages } from "../../middlewares/uploadImages";
import { validateRequest } from "../../middlewares/validateRequest";
import { objectIdSchema } from "../../utils/validators";
import {
  addToWishListHandler,
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  getProductsHandler,
  ratingHandler,
  updateProductHandler,
  uploadImagesHandler,
} from "./product.controller";
import {
  createProductSchema,
  objectProductIdSchema,
  productsQuerySchema,
  ratingSchema,
  updateProductSchema,
} from "./product.schema";

const router = Router();

router.get(
  "/products",
  validateRequest({
    querySchema: productsQuerySchema,
  }),
  getProductsHandler
);

router.get(
  "/products/:id",
  validateRequest({
    paramsSchema: objectIdSchema,
  }),
  getProductHandler
);

router.put(
  "/products/:productId/whishlist",
  verifyToken,
  validateRequest({
    paramsSchema: objectProductIdSchema,
  }),
  addToWishListHandler
);

router.put(
  "/products/:productId/rating",
  verifyToken,
  validateRequest({
    paramsSchema: objectProductIdSchema,
    bodySchema: ratingSchema,
  }),
  ratingHandler
);

router.post(
  "/products",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  validateRequest({
    bodySchema: createProductSchema,
  }),
  createProductHandler
);

router.put(
  "/products/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  validateRequest({
    paramsSchema: objectIdSchema,
    bodySchema: updateProductSchema,
  }),
  updateProductHandler
);

router.delete(
  "/products/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  validateRequest({
    paramsSchema: objectIdSchema,
  }),
  deleteProductHandler
);

/* router.post(
  "/products/:id/images",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
) */

router.put(
  "/products/upload/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  uploadImages("images", true),
  /* processAndUploadImage("products"), */
  uploadImagesHandler
);

export default router;
