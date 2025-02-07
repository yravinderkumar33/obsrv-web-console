import { FormattedMessage } from 'react-intl';
import { DashboardOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { NavItemType } from 'types/menu';

const icons = {
  DashboardOutlined,
  PlusCircleOutlined
};

const other: NavItemType = {
  id: 'datasets',
  title: <FormattedMessage id="Datasets" />,
  type: 'group',
  children: [

    {
      id: 'Datasets',
      title: <FormattedMessage id="Datasets" />,
      type: 'item',
      url: '/datasets',
      icon: icons.DashboardOutlined
    },
    {
      id: 'newDatasets',
      title: <FormattedMessage id="New Dataset" />,
      type: 'item',
      url: '/dataset/new',
      icon: icons.PlusCircleOutlined
    }
  ]
};

export default other;
