import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "./category.service";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.schema";
import { ObjectIdRequest } from "../../utils/validators";

export const createCategoryHandler = asyncHandler(
  async (req: Request<{}, CreateCategoryInput>, res: Response) => {
    const category = await createCategory(req.body);

    res.status(201).json(category);
    return;
  }
);

export const updateCategoryHandler = asyncHandler(
  async (req: Request<ObjectIdRequest, UpdateCategoryInput>, res: Response) => {
    const { id } = req.params;
    const category = await updateCategory(id, req.body);
    res.status(200).json(category);
    return;
  }
);

export const deleteCategoryHandler = asyncHandler(
  async (req: Request<ObjectIdRequest>, res: Response) => {
    const { id } = req.params;
    await deleteCategory(id);
    res.status(204).send();
    return;
  }
);

export const getCategoryHandler = asyncHandler(
  async (req: Request<ObjectIdRequest>, res: Response) => {
    const { id } = req.params;

    const category = await getCategory(id);
    res.status(200).json(category);
    return;
  }
);

export const getCategoriesHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const categories = await getAllCategories();
    res.status(200).json(categories);
    return;
  }
);
