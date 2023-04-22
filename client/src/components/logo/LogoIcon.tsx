import { useTheme } from '@mui/material/styles';
import logoIcon from 'assets/images/half_logo.png';

const LogoIcon = () => {
  const theme = useTheme();

  return (
    <img src={theme.palette.mode === 'dark' ? logoIcon : logoIcon} width="50" />
  );
};

export default LogoIcon;
