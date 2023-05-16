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
                    }
                ],
            },
        ]
        
    },
    {
        path: 'auth',
        routes: [
            {
                path: 'keycloak',
                routes: [
                    {
                        path: '',
                        method: 'GET',
                        middlewares: [
                            passport.authenticate('keycloak', { scope: ['profile'] })
                        ],
                    },  
                    {
                        path: 'callback',
                        method: 'GET',
                        middlewares: [
                            passport.authenticate('keycloak', { successReturnToOrRedirect: '/', failureRedirect: '/login' })
                        ],
                    }
                ]

            },
            {
                path: 'google',
                routes: [
                    {
                        path: '',
                        method: 'GET',
                        middlewares: [
                            passport.authenticate('google', { scope: ['profile','email'] })
                        ],
                    },  
                    {
                        path: 'callback',
                        method: 'GET',
                        middlewares: [
                            passport.authenticate('google', { successReturnToOrRedirect: '/', failureRedirect: '/login' })
                        ],
                    }
                ]

            },
            {
                path: 'ad',
                routes: [
                    {
                        path: '',
                        method: 'POST',
                        middlewares: [
                            passport.authenticate('ActiveDirectory', { failWithError: true, successReturnToOrRedirect: '/', failureRedirect: '/login' })
                        ],
                    }
                ]

            }
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
