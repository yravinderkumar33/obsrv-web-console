import { FormattedMessage } from 'react-intl';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { NavItemType } from 'types/menu';
import { logout } from 'services/profile';
const icons = { LogoutOutlined, SettingOutlined };

const other: NavItemType = {
    id: 'profile',
    title: <FormattedMessage id="Profile" />,
    type: 'group',
    children: [
        // {
        //     id: 'SystemSettings',
        //     title: <FormattedMessage id="SystemSettings" />,
        //     type: 'item',
        //     icon: icons.SettingOutlined,
        //     url: '/systemSettings'
        // },
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


