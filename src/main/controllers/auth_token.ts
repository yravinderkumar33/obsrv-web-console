import { NextFunction, Request, Response } from 'express';
import { oauthServer } from '../auth/auth'

export default {
  name: 'auth:token',
  handler: () => async (request: Request, response: Response, next: NextFunction) => {
    
   return oauthServer.token(
    {
      requireClientAuthentication: { 
        'authorization_code': false,
      },
    })(request, response, next)
    }
};
