import { useRoutes } from 'react-router-dom';

import MainRoutes from './MainRoutes';
import InvalidRoute from './invalidRoute';
import LoginRoute from './LoginRoutes';

export default function ThemeRoutes() {
  return useRoutes([MainRoutes, InvalidRoute, LoginRoute]);
}
