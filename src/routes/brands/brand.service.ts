import { AppError } from "../../utils/AppError";
import { ObjectIdInput } from "../../utils/validators";
import BrandModel from "./brand.model";
import { CreateBrandInput, UpdateBrandInput } from "./brand.schema";

export const createBrand = async (brandInput: CreateBrandInput) => {
  const brand = await BrandModel.create(brandInput);

  return brand;
};

export const updateBrand = async (
  brandId: ObjectIdInput,
  brandInput: UpdateBrandInput
) => {
  const updatedBrand = await BrandModel.findByIdAndUpdate(brandId, brandInput, {
    new: true,
  });

  if (!updatedBrand) {
    throw new AppError("Brand not found", 404);
  }

  return updatedBrand;
};

export const getBrand = async (brandId: ObjectIdInput) => {
  const brand = await BrandModel.findById(brandId);

  if (!brand) {
    throw new AppError("Brand not found", 404);
  }

  return brand;
};

export const getAllBrands = async () => {
  const brands = await BrandModel.find();
  return brands;
};

export const deleteBrand = async (brandId: ObjectIdInput) => {
  const deletedBrand = await BrandModel.findByIdAndDelete(brandId);

  if (!deletedBrand) {
    throw new AppError("Brand not found", 404);
  }

  return deletedBrand;
};
