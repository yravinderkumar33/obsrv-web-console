import { NextFunction, Request, Response } from 'express';

export default {
  name: 'auth',
  handler: () => (request: Request, response: Response, next: NextFunction) => {
    next()
  },
};
