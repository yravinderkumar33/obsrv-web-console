import { NextFunction, Request, Response } from 'express';
import { oauthServer } from './../auth/auth'

import model from './../auth/model'
export default {
  name: 'auth:read',
  handler: () => async (request: Request, response: Response, next: NextFunction) => {
    const { username, password } = request.body
    const user = await model.getUser(username, password)
    if (user) {
      request.body.user = user
      console.log(user)
      try {
        
      } catch (error) {
        
      }
   return oauthServer.authorize(
        {
          authenticateHandler: {
            handle: (request: Request) => {
              return request.body.user
            }
          }
        }
       )(request, response, next)
    }
   
  },
};
