import { Theme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';
import Search from './Search';
import Notification from './Notification';
import MegaMenuSection from './MegaMenuSection'
import Logout from './Logout';


const HeaderContent = () => {
    const matchesXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    return (
        <>
            {matchesXs && <Box sx={{ ml: 1 }} />}
            <Search />
            <MegaMenuSection />
            <Notification />
            <Logout />
        </>
    );
};

export default HeaderContent;
