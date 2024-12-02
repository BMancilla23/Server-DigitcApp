import mongoose from "mongoose";

const bCategorySchema = new mongoose.Schema(
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

const CategoryModel = mongoose.model("BCategory", bCategorySchema);

export default CategoryModel;
