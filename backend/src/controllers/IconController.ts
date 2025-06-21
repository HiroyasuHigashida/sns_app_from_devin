import { NextFunction, Request, Response } from 'express';
import { BaseController } from './BaseController';
import { ValidationError } from '../errors/ValidationError';
import { ParametersSchema, validate } from '../helpers/validator';
import { IconService } from '../services/IconService';
import getIconSchema from '../schemas/getIcon.json';
import updateIconSchema from '../schemas/updateIcon.json';

export class IconController extends BaseController<{
  iconService: IconService;
}> {
  constructor(iconService: IconService) {
    super({ iconService });
  }

  async getIcon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validateResult = validate<ParametersSchema<typeof getIconSchema['properties']>>(
        getIconSchema,
        req.params,
      );
      if (!validateResult.isValid) {
        throw new ValidationError(validateResult.message);
      }

      const iconImage = await this.services.iconService.getIcon(validateResult.values.owner);

      res.status(200).json({ iconImage });
    } catch (err: unknown) {
      next(err as Error);
    }
  }

  async updateIcon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validateResult = validate<ParametersSchema<typeof updateIconSchema['properties']>>(
        updateIconSchema,
        req.body,
      );
      if (!validateResult.isValid) {
        throw new ValidationError(validateResult.message);
      }

      const iconImage = await this.services.iconService.updateIcon(
        res.locals.user.username,
        validateResult.values.iconImage,
      );

      res.status(200).json({ iconImage });
    } catch (err: unknown) {
      next(err as Error);
    }
  }
}
