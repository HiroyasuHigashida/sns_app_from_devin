import { NextFunction, Request, Response } from 'express';
import { BaseController } from './BaseController';
import { ValidationError } from '../errors/ValidationError';
import { ParametersSchema, validate } from '../helpers/validator';
import { PostService } from '../services/PostService';
import likePostSchema from '../schemas/likePost.json';
import unlikePostSchema from '../schemas/unlikePost.json';

export class LikeController extends BaseController<{
  postService: PostService;
}> {
  constructor(postService: PostService) {
    super({ postService });
  }

  async likePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validateResult = validate<ParametersSchema<typeof likePostSchema['properties']>>(
        likePostSchema,
        { postid: Number(req.body.postid) },
      );
      if (!validateResult.isValid) {
        throw new ValidationError(validateResult.message);
      }

      const likeCount = await this.services.postService.likePost(validateResult.values.postid, res.locals.user);

      res.status(201).json({ likeCount, isLiked: true });
    } catch (err: unknown) {
      next(err as Error);
    }
  }

  async unlikePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validateResult = validate<ParametersSchema<typeof unlikePostSchema['properties']>>(
        unlikePostSchema,
        { postid: Number(req.params.postid) },
      );
      if (!validateResult.isValid) {
        throw new ValidationError(validateResult.message);
      }

      const likeCount = await this.services.postService.unlikePost(validateResult.values.postid, res.locals.user);

      res.status(200).json({ likeCount, isLiked: false });
    } catch (err: unknown) {
      next(err as Error);
    }
  }
}
