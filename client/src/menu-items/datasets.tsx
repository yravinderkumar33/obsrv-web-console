import { FormattedMessage } from 'react-intl';
import { OrderedListOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { NavItemType } from 'types/menu';

const icons = {
    OrderedListOutlined,
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
            icon: icons.OrderedListOutlined
        },
        {
            id: 'newDatasets',
            title: <FormattedMessage id="New Dataset" />,
            type: 'item',
            url: '/dataset/new',
            icon: icons.PlusCircleOutlined
        },
        {
            id: 'newMasterDataset',
            title: <FormattedMessage id="New Master Dataset" />,
            type: 'item',
            url: '/dataset/new/master',
            icon: icons.PlusCircleOutlined
        },
    ]
};

export default other;
