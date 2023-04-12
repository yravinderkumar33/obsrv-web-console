import middlewares from '../middlewares';
import commonMiddlewares from '../../shared/middlewares';
import controllers from '../controllers';
import schemaValidator from '../middlewares/schemaValidator';
import kafka from '../utils/validationSchemas/kafka';

export default [
    {
        path: 'report',
        routes: [
            {
                path: 'v1',
                routes: [
                    {
                        path: 'query',
                        method: 'GET',
                        middlewares: [
                            commonMiddlewares.get('set:metadata')?.handler({ id: 'api.report.get' }),
                            controllers.get('prometheus:read')?.handler({}),
                        ],
                    },
                    {
                        path: 'query/range',
                        method: 'GET',
                        middlewares: [
                            commonMiddlewares.get('set:metadata')?.handler({ id: 'api.report.get' }),
                            controllers.get('prometheus:read:range')?.handler({}),
                        ],
                    },
                    {
                        path: 'alerts',
                        method: 'GET',
                        middlewares: [
                            commonMiddlewares.get('set:metadata')?.handler({ id: 'api.report.alerts.get' }),
                            controllers.get('prometheus:alerts')?.handler({}),
                        ],
                    },
                    {
                        path: 'kafka',
                        method: 'POST',
                        middlewares: [
                            schemaValidator.handler({ entityName: 'kafka', schema: 'verify' }),
                            controllers.get('kafka:verify')?.handler({}),
                        ],
                    },
                ],
            },
        ],
    }
];
