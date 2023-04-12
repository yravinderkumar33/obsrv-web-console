import { NextFunction, Request, Response } from 'express';
import { transform } from '../../shared/utils/transformResponse';
import service from '../services/kafka';

export default {
    name: 'kafka:verify',
    handler: () => async (request: Request, response: Response, next: NextFunction) => {
        const { body, responsePayload } = request;
        try {
            const topicsList = await service.getTopics(body.bootstrap);
            const topicExists = topicsList.includes(body.topic);
            const transformedResponse = transform({
                id: responsePayload?.id,
                result: {
                    connectionEstablished: true,
                    topicExists: topicExists,
                }
            });
            return response.json(transformedResponse);
        } catch (error) {
            next(error);
        }
    },
};
