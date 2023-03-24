import { useTheme } from '@mui/material/styles';
import logo from 'assets/images/full_logo.jpeg';


const LogoMain = ({ reverse, ...others }: { reverse?: boolean }) => {
  const theme = useTheme();
  return (
    <>
      <img src={theme.palette.mode === 'dark' ? logo : logo} alt="Mantis" width="150" style={{margin: 'auto'}}/>
    </>
  );
};

export default LogoMain;
