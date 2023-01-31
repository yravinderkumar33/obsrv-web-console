// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { DashboardOutlined } from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  DashboardOutlined
};

const other: NavItemType = {
  id: 'dashboard',
  title: <FormattedMessage id="Dashboard" />,
  type: 'group',
  children: [
    {
      id: 'home',
      title: <FormattedMessage id="Home" />,
      type: 'item',
      url: '/dashboard/home',
      icon: icons.DashboardOutlined
    }
  ]
};

export default other;
