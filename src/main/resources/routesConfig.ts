import commonMiddlewares from '../../shared/middlewares';
import controllers from '../controllers';
import schemaValidator from '../middlewares/schemaValidator';
import authMiddleware from '../middlewares/auth';
import { oauthServer } from '../auth/auth'

export default [
    {
        path: 'oauth',
        routes: [
            {
                path: 'authorize',
                method: 'POST',
                middlewares: [
                    commonMiddlewares.get('set:metadata')?.handler({ id: 'api.auth.read' }),
                    controllers.get('auth:read')?.handler({})
                ],
            },
            {
                path: 'authorize',
                method: 'GET',
                middlewares: [
                    commonMiddlewares.get('set:metadata')?.handler({ id: 'api.auth.read' }),
                    controllers.get('auth:read')?.handler({})
                ],
            },
            {
                path: 'token',
                method: 'POST',
                middlewares: [
                    commonMiddlewares.get('set:metadata')?.handler({ id: 'api.auth.token' }),
                    controllers.get('auth:token')?.handler({})
                ],
            },
            {
                path: 'user-details',
                method: 'get',
                middlewares: [
                    commonMiddlewares.get('set:metadata')?.handler({ id: 'api.auth.user.read' }),
                    oauthServer.authenticate(),
                    controllers.get('auth:user')?.handler({})
                ],
            },
            {
                path: 'logout',
                method: 'get',
                middlewares: [
                    commonMiddlewares.get('set:metadata')?.handler({ id: 'api.auth.user.logout' }),
                    controllers.get('auth:logout')?.handler({})
                ],
            },
            
        ]
    },
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
