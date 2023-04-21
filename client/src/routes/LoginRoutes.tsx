
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import { lazy } from 'react';
const Login = Loadable(lazy(() => import('sections/auth/auth-forms/AuthLogin')));

const MainRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/login',
            element: <Login />
        }
    ]
};

export default MainRoutes;
