import { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// pages routing
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
// render - sample page
const ClusterHealth = Loadable(lazy(() => import('pages/dashboard/datasets')));
const NewDataset = Loadable(lazy(() => import('pages/dataset/newDataset')));
const SystemMetrics = Loadable(lazy(() => import('pages/metrics/metrics')));
const HomePage = Loadable(lazy(() => import('pages/home')));
const MetricsDetails = Loadable(lazy(() => import('pages/metrics/details')));

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
