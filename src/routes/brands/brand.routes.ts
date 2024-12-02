import { Router } from "express";
import {
  createBrandHandler,
  deleteBrandHandler,
  getBrandHandler,
  getBrandsHandler,
  updateBrandHandler,
} from "./brand.controller";
import { verifyRole, verifyToken } from "../../middlewares/authMiddleware";
import { UserRole } from "../../enums/UserRole";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBrandSchema } from "./brand.schema";
import { objectIdSchema } from "../../utils/validators";

const router = Router();

// GET all products
router.get("/brands", getBrandsHandler);

router.get(
  "/brands/:id",
  validateRequest({
    paramsSchema: objectIdSchema,
  }),
  getBrandHandler
);

router.post(
  "/brands",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  validateRequest({
    bodySchema: createBrandSchema,
  }),
  createBrandHandler
);

router.put(
  "/brands/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  validateRequest({
    paramsSchema: objectIdSchema,
    bodySchema: createBrandSchema,
  }),
  updateBrandHandler
);

router.delete(
  "/brands/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  validateRequest({
    paramsSchema: objectIdSchema,
  }),
  deleteBrandHandler
);

export default router;
