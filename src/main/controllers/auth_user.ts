import { NextFunction, Request, Response } from 'express';
import { oauthServer } from '../auth/auth'
export default {
  name: 'auth:user',
  handler: () => async (request: Request, response: Response, next: NextFunction) => {
   console.log(request.headers) 
    const accessToken = await oauthServer.authenticate()(request, response, next);
    request.session.user = accessToken.user;
    console.log(`accessToken :`, accessToken)
  //   console.log(accessToken.user)
  //  if(request.session.user) {
  //   response.send({data:{
  //     "name": request.session.user.username,
  //     "id": request.session.user.id,
  //     "email": request.session.user.email,
  //   }})
  //  } else {
  //   next(new Error("user not found"))
  //  }
}}
;
