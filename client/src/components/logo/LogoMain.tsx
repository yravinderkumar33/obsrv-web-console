import { useTheme } from '@mui/material/styles';
import logo from 'assets/images/full_logo.png';


const LogoMain = ({ reverse, ...others }: { reverse?: boolean }) => {
  const theme = useTheme();
  return (
    <>
      <img 
       id="obsrvLogo" data-edataId="obsrv:logo" data-edataType="CLICK" data-objectId="1.0.0" data-objectType="button"
      src={theme.palette.mode === 'dark' ? logo : logo} alt="Obsrv" width="150" style={{margin: 'auto'}}/>
    </>
  );
};

export default LogoMain;
