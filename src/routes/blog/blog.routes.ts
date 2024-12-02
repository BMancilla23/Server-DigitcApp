import { Router } from "express";
import {
  createBlogHandler,
  deleteBlogHandler,
  dislikeBlogHandler,
  getBlogHandler,
  getBlogsHandler,
  likeBlogHandler,
  updateBlogHandler,
} from "./blog.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createBlogSchema,
  objectBlogIdSchema,
  updateBlogSchema,
} from "./blog.schema";
import { verifyRole, verifyToken } from "../../middlewares/authMiddleware";
import { UserRole } from "../../enums/UserRole";
import { objectIdSchema } from "../../utils/validators";

const router = Router();

router.get(
  "/blog/:id",
  validateRequest({
    paramsSchema: objectIdSchema,
  }),
  getBlogHandler
);

router.get("/blogs", getBlogsHandler);

router.post(
  "/blog",
  verifyToken,
  verifyRole([UserRole.ADMIN]),

  validateRequest({
    bodySchema: createBlogSchema,
  }),
  createBlogHandler
);

router.put(
  "/blog/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  validateRequest({
    paramsSchema: objectIdSchema,
    bodySchema: updateBlogSchema,
  }),
  updateBlogHandler
);

router.delete(
  "/blog/:id",
  verifyToken,
  verifyRole([UserRole.ADMIN]),
  validateRequest({
    paramsSchema: objectIdSchema,
  }),
  deleteBlogHandler
);

router.put(
  "/blog/:blogId/likes",
  verifyToken,
  validateRequest({
    paramsSchema: objectBlogIdSchema,
  }),
  likeBlogHandler
);

router.put(
  "/blog/:blogId/dislikes",
  verifyToken,
  validateRequest({
    paramsSchema: objectBlogIdSchema,
  }),
  dislikeBlogHandler
);

export default router;
