import { NextFunction, Request, Response } from 'express';
import { transform } from '../../shared/utils/transformResponse';

import service from '../services/prometheus'

export default {
  name: 'prometheus:read:range',
  handler: () => async (request: Request, response: Response, next: NextFunction) => {
    const { query, responsePayload } = request;
    try {
      const httpResponse = await service.queryRange({ params: query });
      const transformedResponse = transform({ id: responsePayload?.id, result: httpResponse?.data });
      return response.json(transformedResponse)
    } catch (error) {
      next(error);
    }
  },
};
