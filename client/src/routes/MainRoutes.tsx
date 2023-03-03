import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';

const ClusterHealth = Loadable(lazy(() => import('pages/dashboard/datasets')));
const NewDataset = Loadable(lazy(() => import('pages/dataset/newDataset')));
const SystemMetrics = Loadable(lazy(() => import('pages/metrics/metrics')));
const HomePage = Loadable(lazy(() => import('pages/home')));
const MetricsDetails = Loadable(lazy(() => import('pages/metrics/details')));
const DatasetCreateEvents = Loadable(lazy(() => import('pages/dashboard/createEvents')))

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <MainLayout />
      ),
      children: [
        {
          path: '/',
          element: <HomePage />
        },
        {
          path: 'datasets',
          element: <ClusterHealth />
        },
        {
          path: 'datasets/addEvents/:datasetId',
          element: <DatasetCreateEvents />
        },
        {
          path: 'metrics',
          element: <SystemMetrics />
        },
        {
          path: 'metrics/details',
          element: <MetricsDetails />
        },
        {
          path: 'dataset/new',
          element: <NewDataset />
        }
      ]
    }
  ]
};

export default MainRoutes;
