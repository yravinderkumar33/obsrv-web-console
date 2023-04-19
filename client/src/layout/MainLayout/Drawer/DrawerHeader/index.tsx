
import { useTheme } from '@mui/material/styles';


import DrawerHeaderStyled from './DrawerHeaderStyled';
import Logo from 'components/logo';


interface Props {
  open: boolean;
}

const DrawerHeader = ({ open }: Props) => {
  const theme = useTheme();

  return (
    <DrawerHeaderStyled theme={theme} open={open}>
      <Logo isIcon={!open} sx={{ width: open ? 'auto' : 35, height: 35 }} />
    </DrawerHeaderStyled>
  );
};

export default DrawerHeader;
