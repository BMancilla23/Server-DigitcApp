import asyncHandler from "express-async-handler";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrand,
  updateBrand,
} from "./brand.service";
import { Request, Response } from "express";
import { ObjectIdRequest } from "../../utils/validators";
import { CreateBrandInput, UpdateBrandInput } from "./brand.schema";

export const createBrandHandler = asyncHandler(
  async (req: Request<{}, CreateBrandInput>, res: Response) => {
    const brand = await createBrand(req.body);
    res.status(201).json(brand);
    return;
  }
);

export const updateBrandHandler = asyncHandler(
  async (req: Request<ObjectIdRequest, UpdateBrandInput>, res: Response) => {
    const { id } = req.params;
    const brand = await updateBrand(id, req.body);
    res.status(200).json(brand);
    return;
  }
);

export const getBrandHandler = asyncHandler(
  async (req: Request<ObjectIdRequest>, res: Response) => {
    const { id } = req.params;
    const brand = await getBrand(id);
    res.status(200).json(brand);
    return;
  }
);

export const getBrandsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const brands = await getAllBrands();
    res.status(200).json(brands);
    return;
  }
);

export const deleteBrandHandler = asyncHandler(
  async (req: Request<ObjectIdRequest>, res: Response) => {
    const { id } = req.params;
    await deleteBrand(id);
    res.status(204).send();
    return;
  }
);
