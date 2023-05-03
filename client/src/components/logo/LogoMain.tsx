import { useTheme } from '@mui/material/styles';
import logo from 'assets/images/full_logo.png';


const LogoMain = ({ reverse, ...others }: { reverse?: boolean }) => {
  const theme = useTheme();
  return (
    <>
      <img 
      data-edataid="obsrv:logo"
      src={theme.palette.mode === 'dark' ? logo : logo} alt="Obsrv" width="150" style={{margin: 'auto'}}/>
    </>
  );
};

export default LogoMain;
