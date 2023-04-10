import { NextFunction, Request, Response } from 'express';
import {oauthServer} from './../auth/auth'
export default {
  name: 'auth:read',
  handler: () => async (request: Request, response: Response, next: NextFunction) => {
    const { username, password } = request.body
    if (username === 'username' && password === 'password') {
      request.body.user = { user: 1 }
       oauthServer.authorize({
        authenticateHandler: {
          handle: (request: Request) => {
            console.log("in handler")
            return request.body.user
          }
        }
      })
    } else {
      const params = [
        'client_id',
        'redirect_uri',
        'response_type',
        'grant_type',
        'state',
      ]
        .map(a => `${a}=${request.body[a]}`)
        .join('&')
      return response.redirect(`/oauth?success=false&${params}`)
    }
  },
};
