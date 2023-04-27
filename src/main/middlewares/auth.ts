import { NextFunction, Request, Response } from 'express';
import schemas from '../utils/validationSchemas';
import * as _ from 'lodash';
import Ajv from 'ajv';
const ajv = new Ajv({ allErrors: true });

export default {
    name: 'auth',
    handler:
        (metadata: Record<string, any> = {}) =>
            (request: Request, response: Response, next: NextFunction) => {

                if (request.path.includes("/api/oauth")) {
                    return next();
                }

                const userId = request?.session?.user?.id
                const errorObj = {
                    status: 401,
                    message: "You don't have access to view this resource",
                    responseCode: 'UNAUTHORIZED',
                    errorCode: 'UNAUTHORIZED',
                };

                if (!userId) {
                    return next(errorObj);
                } else {
                    return next()
                }
            },
};
