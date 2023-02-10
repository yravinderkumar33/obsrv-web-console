import middlewares from '../middlewares';
import commonMiddlewares from '../../shared/middlewares';
import controllers from '../controllers';

export default [
  {
    path: 'report',
    routes: [
      {
        path: 'v1',
        routes: [
          {
            path: 'fetch',
            method: 'GET',
            middlewares: [
              commonMiddlewares.get('set:metadata')?.handler({ id: 'api.report.get' }),
              controllers.get('prometheus:read')?.handler({}),
            ],
          }
        ],
      },
    ],
  },
  {
    path: 'obs',
    routes: [
      {
        path: 'v1',
        routes: [
          {
            path: 'generate/schema',
            method: 'POST',
            middlewares: [
              commonMiddlewares.get('set:metadata')?.handler({ id: 'api.schema.generate' }),
              controllers.get('schema:generate')?.handler({}),
            ],
          }
        ],
      },
    ],
  }
];
