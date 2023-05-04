import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';

const DatasetDetails = Loadable(lazy(() => import('pages/dashboard/datasetsDetails')));
const ClusterHealth = Loadable(lazy(() => import('pages/dashboard/datasets')));
const NewDataset = Loadable(lazy(() => import('pages/dataset/newDataset')));
const EditDataset = Loadable(lazy(() => import('pages/dataset/editDataset')));
const SystemMetrics = Loadable(lazy(() => import('pages/metrics/metrics')));
const HomePage = Loadable(lazy(() => import('pages/home')));
const MetricsDetails = Loadable(lazy(() => import('pages/metrics/details')));
const DatasetCreateEvents = Loadable(lazy(() => import('pages/dashboard/createEvents')));

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <HomePage />,
            meta: {
                
            }
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
            element: <NewDataset key="normal" />
        },
        {
            path: 'dataset/edit/:datasetId',
            element: <EditDataset key="normal" />
        },
        {
            path: 'dataset/new/master',
            element: <NewDataset master key="master-dataset" />
        }
    ]
};

export default MainRoutes;
