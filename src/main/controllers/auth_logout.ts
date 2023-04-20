import { NextFunction, Request, Response } from 'express';
export default {
  name: 'auth:logout',
  handler: () => async (request: Request, response: Response, next: NextFunction) => {
    request.session.destroy(function(error: any) {
      if(error) {
        return next(error)
      }
      return response.send({"status": "successful"});
    })
}}
;
