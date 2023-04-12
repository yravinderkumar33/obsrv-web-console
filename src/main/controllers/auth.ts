import { NextFunction, Request, Response } from 'express';
import { oauthServer } from './../auth/auth'

import model from './../auth/model'
export default {
  name: 'auth:read',
  handler: () => async (request: Request, response: Response, next: NextFunction) => {
    if (request.session.user) {
      const user = { user: request.session.user.id }
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
    const { username, password } = request.body
    if (username && password) {
      const user = await model.getUser(username, password)
      request.session.user = user;
      if (user) {
        request.body.user = { user: user.id }
        try {
          return oauthServer.authorize(
            {
              authenticateHandler: {
                handle: (request: Request) => {
                  return request.body.user
                }
              }
            }
          )(request, response, next)
        } catch (error) {
          return next(error)
        }
      } else {
        return next(new Error("user name or password missing"))
      }
    }

  },
};
