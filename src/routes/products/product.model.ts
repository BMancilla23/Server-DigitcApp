import mongoose from "mongoose";
import { ProductColor } from "../../enums/ProductColor";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    /*  category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      // required: true,
    }, */
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    /*  images: [
      {
        type: String,
      },
    ], */
    images: {
      type: [String],
      default: [],
    },
    /* color: {
      type: String,
      // enum: ["Black", "Brown", "Red"],
      enum: Object.values(ProductColor),
    }, */
    color: {
      type: String,
      required: true,
    },
    /*  ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    }, */
    ratings: [
      {
        star: {
          type: Number,
          min: 0,
          max: 5,
        },
        comment: {
          type: String,
        },
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    totalrating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
