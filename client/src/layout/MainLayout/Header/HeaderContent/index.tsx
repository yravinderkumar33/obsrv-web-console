import { Theme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';
import Search from './Search';
import MobileSection from './MobileSection';
import Notification from './Notification';
import MegaMenuSection from './MegaMenuSection'


const HeaderContent = () => {
    const matchesXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    return (
        <>
            {matchesXs && <Box sx={{ ml: 1 }} />}
            <Search />
            <MegaMenuSection />
            <Notification />
            {matchesXs && <MobileSection />}
        </>
    );
};

export default HeaderContent;
