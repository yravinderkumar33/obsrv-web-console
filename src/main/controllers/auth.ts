import { NextFunction, Request, Response } from 'express';
import { oauthServer } from './../auth/auth'

import model from './../auth/model'
export default {
  name: 'auth:read',
  handler: () => async (request: Request, response: Response, next: NextFunction) => {
    let user: { user: any } | null

    if (request.session.user) {
      user = { "user": request.session.user.id };
      return authenticate(user, request, response, next);
    }

    const { username, password } = request.body
    if (!username) {
      return next(new Error("user name missing in request"))
    }

    if (!password) {
      return next(new Error("password missing in request"))
    }
    
    const userObj = await model.getUser(username, password)
    request.session.user = userObj;
    if (userObj) {
      request.body.user = { user: userObj.id }
      return authenticate(request.body.user, request, response, next);
    } else {
      return next(new Error("User not found"))
    }
  },
};

const authenticate = (user: any, request: Request, response: Response, next: NextFunction) => {
  try {
    return oauthServer.authorize(
      {
        authenticateHandler: {
          handle: (request: Request) => {
            return user;
          }
        }
      }
    )(request, response, next)
  } catch (error) {
    return next(error)
  }
}
