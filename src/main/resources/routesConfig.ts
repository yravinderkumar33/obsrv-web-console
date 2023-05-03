import commonMiddlewares from '../../shared/middlewares';
import controllers from '../controllers';
import schemaValidator from '../middlewares/schemaValidator';
import authMiddleware from '../middlewares/auth';
import passport from 'passport';
import { authorization, token } from '../helpers/oauth';

export default [
    {
        path: "oauth",
        routes: [
            {
                path: 'v1',
                routes: [
                    {
                        path: 'login',
                        method: 'POST',
                        middlewares: [
                            passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' })
                        ],
                    },
                    {
                        path: 'logout',
                        method: 'GET',
                        middlewares: [
                            controllers.get('auth:logout')?.handler({}),
                        ],
                    },
                    {
                        path: 'authorize',
                        method: 'GET',
                        middlewares: [
                            authorization
                        ],
                    },
                    {
                        path: 'token',
                        method: 'POST',
                        middlewares: [
                            token
                        ],
                    },
                    {
                        path: 'userinfo',
                        method: 'GET',
                        middlewares: [
                            passport.authenticate('bearer', { session: false }),
                            controllers.get('auth:user:info')?.handler({}),
                        ],
                    },
                    
                    
                ],
            },
        ],
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
