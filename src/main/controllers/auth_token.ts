import { NextFunction, Request, Response } from 'express';
import { oauthServer } from '../auth/auth'
import model from '../auth/model';

export default {
  name: 'auth:token',
  handler: () => async (request: Request, response: Response, next: NextFunction) => {
    return oauthServer.token(
      {
        requireClientAuthentication: {
        },
      })(request, response, next)
  }
};
