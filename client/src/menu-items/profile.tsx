import { FormattedMessage } from 'react-intl';
import { LogoutOutlined } from '@ant-design/icons';
import { NavItemType } from 'types/menu';
import { logout } from 'services/profile';

const icons = { LogoutOutlined };

const other: NavItemType = {
    id: 'profile',
    title: <FormattedMessage id="Profile" />,
    type: 'group',
    children: [
        {
            id: 'Logout',
            title: <FormattedMessage id="Logout" />,
            type: 'item',
            icon: icons.LogoutOutlined,
            onClick: logout
        }
    ]
};

export default other;


