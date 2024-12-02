import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ObjectIdRequest } from "../../utils/validators";
import {
  CreateBlogInput,
  ObjectBlogIdInput,
  UpdateBlogInput,
} from "./blog.schema";
import {
  createBlog,
  deleteBlog,
  getBlog,
  getBlogs,
  toggleDislikeBlog,
  toggleLikeBlog,
  updateBlog,
} from "./blog.service";

export const createBlogHandler = asyncHandler(
  async (req: Request<{}, CreateBlogInput>, res: Response) => {
    const blog = await createBlog(req.body);

    res.status(201).json(blog);

    return;
  }
);

export const updateBlogHandler = asyncHandler(
  async (req: Request<ObjectIdRequest, UpdateBlogInput>, res: Response) => {
    const { id } = req.params;

    const blog = await updateBlog(id, req.body);

    res.status(200).json(blog);

    return;
  }
);

export const getBlogHandler = asyncHandler(
  async (req: Request<ObjectIdRequest>, res: Response) => {
    const { id } = req.params;
    const blog = await getBlog(id);

    res.status(200).json(blog);

    return;
  }
);

export const getBlogsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const blogs = await getBlogs();

    res.status(200).json(blogs);
    return;
  }
);

export const deleteBlogHandler = asyncHandler(
  async (req: Request<ObjectIdRequest>, res: Response) => {
    const { id } = req.params;
    await deleteBlog(id);

    res.status(204).json();
    return;
  }
);

export const likeBlogHandler = asyncHandler(
  async (req: Request<ObjectBlogIdInput>, res: Response) => {
    const { blogId } = req.params;
    /*   console.log(blogId); */

    const userId = req.userId!;

    const blog = await toggleLikeBlog(blogId, userId);

    res.status(200).json(blog);
  }
);

export const dislikeBlogHandler = asyncHandler(
  async (req: Request<ObjectBlogIdInput>, res: Response) => {
    const { blogId } = req.params;

    const userId = req.userId!;

    const blog = await toggleDislikeBlog(blogId, userId);

    res.status(200).json(blog);
  }
);
