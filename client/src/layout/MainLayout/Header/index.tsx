import { ReactNode, useMemo } from 'react';


import { useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, useMediaQuery, AppBarProps } from '@mui/material';


import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';
import IconButton from 'components/@extended/IconButton';


import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import ClusterStatus from 'sections/widgets/Cluster';
import { useSelector } from 'react-redux';


interface Props {
    open: boolean;
    handleDrawerToggle?: () => void;
    wizard?: boolean;
}

const Header = ({ open, handleDrawerToggle }: Props) => {
    const theme = useTheme();
    const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));
    const globalConfigState: Record<string, any> = useSelector((state: any) => state.config);


    const headerContent = useMemo(() => <HeaderContent />, []);

    const iconBackColorOpen = theme.palette.mode === 'dark' ? 'grey.200' : 'grey.300';
    const iconBackColor = theme.palette.mode === 'dark' ? 'background.default' : 'grey.100';

    const mainHeader: ReactNode = (
        <div id='rootHeader'>
            <Toolbar>
                <IconButton
                    aria-label="open drawer"
                    onClick={handleDrawerToggle}
                    edge="start"
                    color="secondary"
                    variant="light"
                    sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor, ml: { xs: 0, lg: -2 } }}
                >
                    {!open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </IconButton>
                {headerContent}
            </Toolbar>
        </div>
    );


    const appBar: AppBarProps = {
        position: 'fixed',
        color: 'inherit',
        elevation: 0,
        sx: {
            borderBottom: `1px solid ${theme.palette.divider}`,
            zIndex: 1200
        }
    };

    return (
        <>
            {!matchDownMD ? (
                <AppBarStyled open={open} {...appBar}>
                    {mainHeader}
                </AppBarStyled>
            ) : (
                <AppBar {...appBar}>
                    {mainHeader}
                </AppBar>
            )}
        </>
    );
};

export default Header;
