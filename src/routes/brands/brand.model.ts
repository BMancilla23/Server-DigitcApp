import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    /* logo: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    }, */
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields automatically
  }
);

const BrandModel = mongoose.model("Brand", brandSchema);

export default BrandModel;
