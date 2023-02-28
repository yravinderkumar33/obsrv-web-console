import { FormattedMessage } from 'react-intl';
import { HomeOutlined } from '@ant-design/icons';
import { NavItemType } from 'types/menu';

const icons = {
  HomeOutlined
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
      url: '/',
      icon: icons.HomeOutlined
    }
  ]
};

export default other;
