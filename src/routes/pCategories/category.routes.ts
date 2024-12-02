import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCategorySchema, updateCategorySchema } from "./category.schema";
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getCategoriesHandler,
  getCategoryHandler,
  updateCategoryHandler,
} from "./category.controller";
import { objectIdSchema } from "../../utils/validators";
import { verifyRole, verifyToken } from "../../middlewares/authMiddleware";
import { UserRole } from "../../enums/UserRole";

const router = Router();

router.post(
  "/categories/products",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  validateRequest({
    bodySchema: createCategorySchema,
  }),
  createCategoryHandler
);
router.get("/categories/products", getCategoriesHandler);

router.get(
  "/categories/:id/products",
  validateRequest({
    paramsSchema: objectIdSchema,
  }),
  getCategoryHandler
);
router.put(
  "/categories/:id/products",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  validateRequest({
    paramsSchema: objectIdSchema,
    bodySchema: updateCategorySchema,
  }),
  updateCategoryHandler
);

router.delete(
  "/categories/:id/products",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  validateRequest({
    paramsSchema: objectIdSchema,
  }),
  deleteCategoryHandler
);

export default router;
