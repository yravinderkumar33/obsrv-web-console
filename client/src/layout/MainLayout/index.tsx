import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Box, Container, Toolbar } from '@mui/material';
import Drawer from './Drawer';
import Header from './Header';
import useConfig from 'hooks/useConfig';
import { RootStateProps } from 'types/root';
import { openDrawer } from 'store/reducers/menu';
import ScrollButton from 'components/ScrollButton';

const MainLayout = () => {
    const theme = useTheme();
    const location = useLocation();
    const [mainContainerHeight, setMainContainerHeight] = useState(0)
    const globalConfig = useSelector((state: any) => state.config)
    const matchDownLG = useMediaQuery(theme.breakpoints.down('xl'));

    const { container, miniDrawer } = useConfig();
    const dispatch = useDispatch();

    const menu = useSelector((state: RootStateProps) => state.menu);
    const { drawerOpen } = menu;

    const [open, setOpen] = useState(!miniDrawer || drawerOpen);
    const handleDrawerToggle = () => {
        setOpen(!open);
        dispatch(openDrawer({ drawerOpen: !open }));
    };

    useEffect(() => {
        if (!miniDrawer) {
            setOpen(!matchDownLG);
            dispatch(openDrawer({ drawerOpen: !matchDownLG }));
        }
        setMainContainerHeight(document.querySelector("#rootHeader")?.clientHeight || 0)
    }, [matchDownLG, globalConfig]);

    return (
        <>
            <Box sx={{ display: 'flex', width: '100%', }} position="relative">
                <Header open={open} handleDrawerToggle={handleDrawerToggle} />
                <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
                <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, py: { xs: 2, sm: 2 }, px: { xs: 2, sm: 1 } }}>
                    <Toolbar style={{ 'height': `${mainContainerHeight}px` }} />
                    {container && (
                        <>
                            <Container
                                maxWidth="xl"
                                sx={{ px: { xs: 0, sm: 2 }, position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 'calc(110vh - 220px)' }}
                            >
                                <Outlet />
                            </Container>
                        </>
                    )}
                    {!container && (
                        <>
                            <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 'calc(110vh - 220px)' }}>
                                <Outlet />
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
            <ScrollButton />
        </>
    );
};

export default MainLayout;
