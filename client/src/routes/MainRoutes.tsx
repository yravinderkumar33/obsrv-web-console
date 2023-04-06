import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';
import DatasetDetails from 'pages/dashboard/datasetsDetails';

const ClusterHealth = Loadable(lazy(() => import('pages/dashboard/datasets')));
const NewDataset = Loadable(lazy(() => import('pages/dataset/newDataset')));
const SystemMetrics = Loadable(lazy(() => import('pages/metrics/metrics')));
const HomePage = Loadable(lazy(() => import('pages/home')));
const MetricsDetails = Loadable(lazy(() => import('pages/metrics/details')));
const DatasetCreateEvents = Loadable(lazy(() => import('pages/dashboard/createEvents')))

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
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
            path: 'datasets/:datasetId',
            element: <DatasetDetails />
        },
        {
            path: 'datasets/addEvents/:datasetId/:datasetName',
            element: <DatasetCreateEvents />
        },
        {
            path: 'metrics',
            element: <SystemMetrics />
        },
        {
            path: 'metrics/details/:metricId',
            element: <MetricsDetails />
        },
        {
            path: 'dataset/new',
            element: <NewDataset />
        },
        {
            path: 'dataset/new/:id',
            element: <NewDataset master />
        }
    ]
};

export default MainRoutes;
