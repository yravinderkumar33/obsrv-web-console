// import { useMemo } from 'react';

// material-ui
import { Theme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';

// project import
import Search from './Search';
// import Message from './Message';
import Profile from './Profile';
// import Notification from './Notification';
import MobileSection from './MobileSection';
import { Avatar } from '@mui/material';
import { ApiOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setConfig } from 'store/reducers/config';
// import MegaMenuSection from './MegaMenuSection';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const globalConfig = useSelector((state: any) => state?.config)
  const dispatch = useDispatch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const megaMenu = useMemo(() => <MegaMenuSection />, []);

  return (
    <>
      {!matchesXs && <Search />}
      {/* {!matchesXs && megaMenu} */}
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}
      {/* <Notification /> */}
      {/* <Message /> */}
      <Avatar sx={{ width: 30, height: 30 }} onClick={e => {
        dispatch(setConfig({ key: 'showClusterMenu', value: !(globalConfig?.showClusterMenu) }))
      }}> <ApiOutlined /></Avatar>
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
