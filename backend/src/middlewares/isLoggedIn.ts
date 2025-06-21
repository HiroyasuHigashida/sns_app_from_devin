import { Request, Response, NextFunction } from 'express';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { logAuthTokenInvalid, logSysCrash } from '../helpers/logger';
import { ParametersSchema, validate } from '../helpers/validator';
import { UserRepository } from '../repositories/UserRepository';
import { UserService } from '../services/UserService';
import isLoggedInSchema from '../schemas/isLoggedIn.json';

const userPoolId = process.env.COGNITO_USER_POOL_ID_LOCAL || process.env.COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID_LOCAL || process.env.COGNITO_CLIENT_ID;

const verifier = CognitoJwtVerifier.create({
  tokenUse: 'id',
  userPoolId,
  clientId,
});

if (process.env.COGNITO_JWKS_LOCAL) {
  const jwks = JSON.parse(process.env.COGNITO_JWKS_LOCAL);
  verifier.cacheJwks(jwks);
}

const handleInvalidToken = (req: Request, res: Response, error: Error) => {
  logAuthTokenInvalid(req, error.message);
  return res.status(401).json({ message: 'Unauthorized' });
};

const handleSystemError = (req: Request, res: Response, error: Error) => {
  logSysCrash(req, error.message);
  return res.status(500).json({ message: 'Internal Server Error' });
};

export const isLoggedIn = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const { isValid, values, message } = validate<ParametersSchema<typeof isLoggedInSchema['properties']>>(isLoggedInSchema, req.headers);
  if (!isValid) {
    return handleInvalidToken(req, res, new Error(message));
  }

  let payload: { 'cognito:username': string };
  try {
    payload = await verifier.verify(values.authorization);
  } catch (error: unknown) {
    return handleInvalidToken(req, res, error as Error);
  }

  try {
    const userService = new UserService(UserRepository);
    res.locals.user = await userService.getOrSaveUser(payload['cognito:username']);
    next();
  } catch (error: unknown) {
    return handleSystemError(req, res, error as Error);
  }
};
