import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Box, Container, Toolbar } from '@mui/material';

// project import
import Drawer from './Drawer';
import Header from './Header';
import Footer from './Footer';
import navigation from 'menu-items';
import useConfig from 'hooks/useConfig';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// types
import { RootStateProps } from 'types/root';
import { openDrawer } from 'store/reducers/menu';
import ScrollButton from 'components/ScrollButton';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
    const theme = useTheme();
    const [mainContainerHeight, setMainContainerHeight] = useState(0)
    const globalConfig = useSelector((state: any) => state.config)
    const matchDownLG = useMediaQuery(theme.breakpoints.down('xl'));

    const { container, miniDrawer } = useConfig();
    const dispatch = useDispatch();

    const menu = useSelector((state: RootStateProps) => state.menu);
    const { drawerOpen } = menu;

    // drawer toggler
    const [open, setOpen] = useState(!miniDrawer || drawerOpen);
    const handleDrawerToggle = () => {
        setOpen(!open);
        dispatch(openDrawer({ drawerOpen: !open }));
    };

    // set media wise responsive drawer
    useEffect(() => {
        if (!miniDrawer) {
            setOpen(!matchDownLG);
            dispatch(openDrawer({ drawerOpen: !matchDownLG }));
        }
        setMainContainerHeight(document.querySelector("#rootHeader")?.clientHeight || 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchDownLG, globalConfig]);

    // useEffect(() => {
    //   if (open !== drawerOpen) setOpen(drawerOpen);
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [drawerOpen]);


    return (
        <>
            <Box sx={{ display: 'flex', width: '100%', }} position="relative">
                <Header open={open} handleDrawerToggle={handleDrawerToggle} />
                <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
                <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, py: { xs: 2, sm: 3 }, px: { xs: 2, sm: 1 } }}>
                    <Toolbar style={{ 'height': `${mainContainerHeight}px` }} />
                    {container && (
                        <>
                            <Container
                                maxWidth="xl"
                                sx={{ px: { xs: 0, sm: 2 }, position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 'calc(110vh - 220px)' }}
                            >
                                <Breadcrumbs navigation={navigation} title titleBottom card={false} divider={false} />
                                <Outlet />
                            </Container>
                            <Footer />
                        </>
                    )}
                    {!container && (
                        <>
                            <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 'calc(110vh - 220px)' }}>
                                <Breadcrumbs navigation={navigation} title titleBottom card={false} divider={false} />
                                <Outlet />
                            </Box>
                            <Footer />
                        </>
                    )}
                </Box>
            </Box>
            <ScrollButton />
        </>
    );
};

export default MainLayout;
