import { useSelector } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import { Box, List, Typography } from '@mui/material';

import NavItem from './NavItem';
import NavCollapse from './NavCollapse';


import { NavItemType } from 'types/menu';
import { RootStateProps } from 'types/root';



interface Props {
    item: NavItemType;
    handleDrawerToggle: () => void;
}

const NavGroup = ({ item, handleDrawerToggle }: Props) => {
    const theme = useTheme();
    const menu = useSelector((state: RootStateProps) => state.menu);
    const { drawerOpen } = menu;

    const navCollapse = item.children?.map((menuItem) => {
        switch (menuItem.type) {
            case 'collapse':
                return <NavCollapse key={menuItem.id} menu={menuItem} level={1} handleDrawerToggle={handleDrawerToggle} />;
            case 'item':
                return <NavItem key={menuItem.id} item={menuItem} level={1} handleDrawerToggle={handleDrawerToggle} />;
            default:
                return (
                    <Typography key={menuItem.id} variant="h6" color="error" align="center">
                        Fix - Group Collapse or Items
                    </Typography>
                );
        }
    });

    return (
        <List
            subheader={
                item.title &&
                drawerOpen && (
                    <Box sx={{ pl: 3, mb: 1.5 }}>
                        <Typography variant="subtitle2" color={'textSecondary'}>
                            {item.title}
                        </Typography>
                        {item.caption && (
                            <Typography variant="caption" color="secondary">
                                {item.caption}
                            </Typography>
                        )}
                    </Box>
                )
            }
            sx={{ mt: drawerOpen && item.title ? 1.5 : 0, py: 0, zIndex: 0 }}
        >
            {navCollapse}
        </List>
    );
};

export default NavGroup;
