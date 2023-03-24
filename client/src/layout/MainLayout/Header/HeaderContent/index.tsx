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
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}
      {!matchesXs && <Search />}
      <MegaMenuSection />
      <Notification />
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
