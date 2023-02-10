import { NextFunction, Request, Response } from 'express';
import service from '../services/obs-api'

export default {
    name: 'schema:generate',
    handler: () => async (request: Request, response: Response, next: NextFunction) => {
        const { query, body, headers } = request;
        try {
            const httpResponse = await service.generateSchema({ params: query, headers, body });
            return response.json(httpResponse?.data)
        } catch (error: any) {
            const errorObject = error?.response?.data
            if (errorObject && typeof errorObject === 'object') {
                return response.json(errorObject)
            }
            next(error);
        }
    },
};
