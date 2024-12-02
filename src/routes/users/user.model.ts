import mongoose, { Types } from "mongoose";
import { UserRole } from "../../enums/UserRole";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      /*  default: "user", */
      /* enum: ["user", "admin"], */
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    cart: {
      type: Array,
      default: [],
    },
    address: {
      type: String,
    },
    wishlist: [
      {
        type: Types.ObjectId,
        ref: "Product",
      },
    ],
    /* refreshToken: {
      type: String,
    }, */
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpiration: {
      type: Date,
    },
    passwordChangeAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
