import middlewares from '../middlewares';
import commonMiddlewares from '../../shared/middlewares';
import controllers from '../controllers';

export default [
  {
    path: 'oauth',
    routes: [
      {
        path: 'authorize',
        method: 'POST',
        middlewares: [
          commonMiddlewares.get('set:metadata')?.handler({ id: 'api.auth.post' }),
          controllers.get('auth:read')?.handler({}),
        ],
      }
    ]
  },
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
          }
        ],
      },
    ],
    
  }
];
