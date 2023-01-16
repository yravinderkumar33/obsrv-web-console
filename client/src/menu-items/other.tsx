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

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const other: NavItemType = {
  id: 'dashboard',
  title: <FormattedMessage id="Dashboard" />,
  type: 'group',
  children: [
    {
      id: 'cluster',
      title: <FormattedMessage id="Cluster" />,
      type: 'item',
      url: '/dashboard/cluster',
      icon: icons.DashboardOutlined
    },
    {
      id: 'dataset',
      title: <FormattedMessage id="Dataset" />,
      type: 'item',
      url: '/dashboard/dataset',
      icon: icons.DashboardOutlined
    }
  ]
};

export default other;
