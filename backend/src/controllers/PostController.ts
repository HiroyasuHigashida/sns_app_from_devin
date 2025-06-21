import { NextFunction, Request, Response } from 'express';
import { BaseController } from './BaseController';
import { ValidationError } from '../errors/ValidationError';
import { ParametersSchema, validate } from '../helpers/validator';
import { PostService } from '../services/PostService';
import getPostsSchema from '../schemas/getPosts.json';
import getOwnerPostsSchema from '../schemas/getOwnerPosts.json';
import postPostSchema from '../schemas/postPost.json';
import updatePostSchema from '../schemas/updatePost.json';
import deletePostSchema from '../schemas/deletePost.json';

export class PostController extends BaseController<{
  postService: PostService;
}> {
  constructor(postService: PostService) {
    super({ postService });
  }

  async getPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validateResult = validate<ParametersSchema<typeof getPostsSchema['properties']>>(getPostsSchema, {
        offset: req.query.offset ? Number(req.query.offset) : req.query.offset,
        limit: req.query.limit ? Number(req.query.limit) : req.query.limit,
      });
      if (!validateResult.isValid) {
        throw new ValidationError(validateResult.message);
      }

      const postDtos = await this.services.postService.findPosts(
        res.locals.user.id,
        '',
        validateResult.values.offset,
        validateResult.values.limit,
      );

      res.status(200).json({ Items: postDtos });
    } catch (err: unknown) {
      next(err as Error);
    }
  }

  async getOwnerPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validateResult = validate<ParametersSchema<typeof getOwnerPostsSchema['properties']>>(
        getOwnerPostsSchema,
        {
          owner: req.params.owner,
          offset: req.query.offset ? Number(req.query.offset) : req.query.offset,
          limit: req.query.limit ? Number(req.query.limit) : req.query.limit,
        },
      );
      if (!validateResult.isValid) {
        throw new ValidationError(validateResult.message);
      }

      const postDtos = await this.services.postService.findPosts(
        res.locals.user.id,
        validateResult.values.owner,
        validateResult.values.offset,
        validateResult.values.limit,
      );

      res.status(200).json({ Items: postDtos });
    } catch (err: unknown) {
      next(err as Error);
    }
  }

  async postPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validateResult = validate<ParametersSchema<typeof postPostSchema['properties']>>(postPostSchema, req.body);
      if (!validateResult.isValid) {
        throw new ValidationError(validateResult.message);
      }

      const postDto = await this.services.postService.createPost(
        validateResult.values.content,
        res.locals.user,
      );

      res.status(201).json(postDto);
    } catch (err: unknown) {
      next(err as Error);
    }
  }

  async updatePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validateResult = validate<ParametersSchema<typeof updatePostSchema['properties']>>(
        updatePostSchema,
        {
          postid: Number(req.params.postid),
          content: req.body.content,
        },
      );
      if (!validateResult.isValid) {
        throw new ValidationError(validateResult.message);
      }

      const postDtos = await this.services.postService.updatePost(
        validateResult.values.postid,
        validateResult.values.content,
        res.locals.user,
      );

      res.status(200).json(postDtos);
    } catch (err: unknown) {
      next(err as Error);
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validateResult = validate<ParametersSchema<typeof deletePostSchema['properties']>>(
        deletePostSchema,
        { postid: Number(req.params.postid) },
      );
      if (!validateResult.isValid) {
        throw new ValidationError(validateResult.message);
      }

      await this.services.postService.deletePost(validateResult.values.postid, res.locals.user);

      res.status(204).json({});
    } catch (err: unknown) {
      next(err as Error);
    }
  }
}
