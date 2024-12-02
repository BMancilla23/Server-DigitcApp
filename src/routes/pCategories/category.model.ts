import mongoose from "mongoose";

const pCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const CategoryModel = mongoose.model("PCategory", pCategorySchema);

export default CategoryModel;
