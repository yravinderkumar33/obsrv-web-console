import { NextFunction, Request, Response } from 'express';
import { db } from '../auth/auth_db';
export default {
  name: 'auth:user',
  handler: () => async (request: Request, response: Response, next: NextFunction) => {
    const userId = response.locals.oauth.token.user.id
    const user: any = db.users.find((user) => user.id == userId)
    response.send({
        "id": user["id"],
        "name": user["username"],
        "email": user["email"]
    })
  }
}
  ;
