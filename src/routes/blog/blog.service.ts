import { ObjectId, Types } from "mongoose";
import { AppError } from "../../utils/AppError";
import { ObjectIdInput } from "../../utils/validators";
import BlogModel from "./blog.model";
import { CreateBlogInput, UpdateBlogInput } from "./blog.schema";

export const createBlog = async (blogInput: CreateBlogInput) => {
  const blog = await BlogModel.create(blogInput);

  return blog;
};

export const updateBlog = async (
  blogId: ObjectIdInput,
  blogInput: UpdateBlogInput
) => {
  const updatedBlog = await BlogModel.findByIdAndUpdate(blogId, blogInput, {
    new: true,
  });

  if (!updatedBlog) {
    throw new Error("Blog not found");
  }

  return updatedBlog;
};

export const getBlog = async (blogId: ObjectIdInput) => {
  const blog = await BlogModel.findById(blogId)
    .populate("likes")
    .populate("dislikes");

  await BlogModel.findByIdAndUpdate(
    blogId,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!blog) {
    throw new AppError("Blog not found", 404);
  }

  return blog;
};

export const getBlogs = async () => {
  const blogs = await BlogModel.find().sort({ createdAt: -1 });

  return blogs;
};

export const deleteBlog = async (blogId: ObjectIdInput) => {
  const deletedBlog = await BlogModel.findByIdAndDelete(blogId);

  if (!deletedBlog) {
    throw new AppError("Blog not found", 404);
  }

  return deletedBlog;
};

export const toggleLikeBlog = async (blogId: string, userId: string) => {
  const blog = await BlogModel.findById(blogId);

  if (!blog) {
    throw new AppError("Blog not found", 404);
  }

  // Convertimos `userId` a `ObjectId`
  const userObjectId = new Types.ObjectId(userId);

  const alreadyLiked = blog.likes.some((id) => id.equals(userObjectId));
  const alreadyDisliked = blog.dislikes.some((id) => id.equals(userObjectId));

  if (alreadyDisliked) {
    // Remove dislike
    blog.dislikes = blog.dislikes.filter((id) => !id.equals(userObjectId));
    blog.isDisliked = false;
  }

  if (alreadyLiked) {
    // Remove like
    blog.likes = blog.likes.filter((id) => !id.equals(userObjectId));
    blog.isLiked = false;
  } else {
    // Add like
    blog.likes.push(userObjectId);
    blog.isLiked = true;
  }

  await blog.save();
  return blog;
};

export const toggleDislikeBlog = async (blogId: string, userId: string) => {
  const blog = await BlogModel.findById(blogId);

  if (!blog) {
    throw new AppError("Blog not found", 404);
  }

  const userObjectId = new Types.ObjectId(userId);

  const alreadyDisliked = blog.dislikes.some((id) => id.equals(userObjectId));
  const alreadyLiked = blog.likes.some((id) => id.equals(userObjectId));

  if (alreadyLiked) {
    // Eliminar el like si existe
    blog.likes = blog.likes.filter((id) => !id.equals(userObjectId));
    blog.isLiked = false;
  }

  if (alreadyDisliked) {
    // Remover dislike
    blog.dislikes = blog.dislikes.filter((id) => !id.equals(userObjectId));
    blog.isDisliked = false;
  } else {
    // Añadir dislike
    blog.dislikes.push(userObjectId);
    blog.isDisliked = true;
  }

  await blog.save();
  return blog;
};
