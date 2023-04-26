import commonMiddlewares from '../../shared/middlewares';
import controllers from '../controllers';
import schemaValidator from '../middlewares/schemaValidator';
import authMiddleware from '../middlewares/auth';

export default [
    {
        path: 'report',
        routes: [
            {
                path: 'v1',
                routes: [
                    {
                        path: 'kafka',
                        method: 'POST',
                        middlewares: [
                            authMiddleware.handler({}),
                            schemaValidator.handler({ entityName: 'kafka', schema: 'verify' }),
                            controllers.get('kafka:verify')?.handler({}),
                        ],
                    },
                ],
            },
        ],
    }
];
