import { AppError } from "../../utils/AppError";
import { ObjectIdInput } from "../../utils/validators";
import CategoryModel from "./category.model";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.schema";

export const createCategory = async (categoryInput: CreateCategoryInput) => {
  const category = await CategoryModel.create(categoryInput);

  return category;
};

export const updateCategory = async (
  categoryId: ObjectIdInput,
  categoryInput: UpdateCategoryInput
) => {
  const updatedCategory = await CategoryModel.findByIdAndUpdate(
    categoryId,
    categoryInput,
    { new: true }
  );

  if (!updatedCategory) {
    throw new AppError("Category not found", 404);
  }

  return updatedCategory;
};

export const deleteCategory = async (categoryId: ObjectIdInput) => {
  const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);

  if (!deletedCategory) {
    throw new AppError("Category not found", 404);
  }

  return deletedCategory;
};

export const getCategory = async (categoryId: ObjectIdInput) => {
  const category = await CategoryModel.findById(categoryId);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};

export const getAllCategories = async () => {
  const categories = await CategoryModel.find();
  return categories;
};
