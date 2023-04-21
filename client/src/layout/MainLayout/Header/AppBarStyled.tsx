import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import { drawerWidth } from 'config';

const AppBarStyled = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })((config: any) => {
    const { theme, open } = config;
    return {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            })
        })
    }

});

export default AppBarStyled;
