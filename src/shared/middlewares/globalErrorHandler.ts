/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { transform } from '../utils/transformResponse';

export default {
  name: 'globalErrorHandler',
  handler: () => (error: any, request: Request, response: Response, next: NextFunction) => {
    const { message = 'Internal Server Error', status = 500, responseCode = 'SERVER_ERROR', errorCode = 'SERVER_ERROR' } = error;

    const { id = 'api' } = request.responsePayload || {};

    if (request.url.includes("oauth/v1/login")) {
      console.log(error);
      return response.redirect(`/login?err=Invalid Credentials`);
    }

    response.status(status).json(transform({ id, responseCode, params: { err: errorCode, errmsg: message } }));
  },
};
