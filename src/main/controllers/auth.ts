import { NextFunction, Request, Response } from 'express';
import { oauthServer } from './../auth/auth'
import * as _ from 'lodash'

import model from './../auth/model'

const redirectToLoginPage = (response: Response, error: string) => {
  response.redirect(`/login?err=${error}`);
}

export default {
  name: 'auth:read',
  handler: () => async (request: Request, response: Response, next: NextFunction) => {
    let user: { user: any } | null

    if (_.get(request, 'session.user')) {
      user = { "user": _.get(request, 'session.user.id') };
      return authenticate(user, request, response, next);
    }

    const { username, password } = request.body
    if (!username) {
      return redirectToLoginPage(response, "missing username");
    }

    if (!password) {
      return redirectToLoginPage(response, "missing password");
    }

    const userObj = await model.getUser(username, password)
    request.session.user = userObj;
    if (userObj) {
      request.body.user = { user: userObj.id }
      return authenticate(request.body.user, request, response, next);
    } else {
      return redirectToLoginPage(response, "user not found");
    }
  }
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
