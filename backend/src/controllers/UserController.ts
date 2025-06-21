import { NextFunction, Request, Response } from 'express';
import { BaseController } from './BaseController';
import { ValidationError } from '../errors/ValidationError';
import { ParametersSchema, validate } from '../helpers/validator';
import { UserService } from '../services/UserService';
import getProfileSchema from '../schemas/getProfile.json';
import updateProfileSchema from '../schemas/updateProfile.json';

export class UserController extends BaseController<{
  userService: UserService;
}> {
  constructor(userService: UserService) {
    super({ userService });
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validateResult = validate<ParametersSchema<typeof getProfileSchema['properties']>>(
        getProfileSchema,
        req.params,
      );
      if (!validateResult.isValid) {
        throw new ValidationError(validateResult.message);
      }

      const profile = await this.services.userService.getProfile(validateResult.values.owner);

      res.status(200).json({ profile });
    } catch (err: unknown) {
      next(err as Error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validateResult = validate<ParametersSchema<typeof updateProfileSchema['properties']>>(
        updateProfileSchema,
        { profile: req.body.profile },
      );
      if (!validateResult.isValid) {
        throw new ValidationError(validateResult.message);
      }

      const profile = await this.services.userService.updateProfile(
        res.locals.user.username,
        validateResult.values.profile,
      );

      res.status(200).json({ profile });
    } catch (err: unknown) {
      next(err as Error);
    }
  }
}
