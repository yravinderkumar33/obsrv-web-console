import { FormattedMessage } from 'react-intl';
import { HomeOutlined } from '@ant-design/icons';
import { NavItemType } from 'types/menu';
import { metricsMetadata } from 'data/metrics'

const icons = {
  HomeOutlined
};

const other: NavItemType = {
  id: 'dashboard',
  title: <FormattedMessage id="Dashboard" />,
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: <FormattedMessage id="dashboard" />,
      type: 'collapse',
      icon: icons.HomeOutlined,
      children: [
        {
          id: 'All',
          title: <FormattedMessage id="All" />,
          type: 'item',
          url: '/',
          icon: icons.HomeOutlined
        },
        ...(metricsMetadata.map(metric => ({
          id: metric.id,
          title: <FormattedMessage id={metric.primaryLabel} />,
          type: 'item',
          url: `/metrics/details?id=${metric.id}`,
          icon: metric.menuIcon || icons.HomeOutlined
        })))
      ]
    },
  ]
};

export default other;


