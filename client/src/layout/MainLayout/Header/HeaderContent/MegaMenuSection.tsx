import { useTheme } from '@mui/material/styles';
import { Box, Avatar } from '@mui/material';
import IconButton from 'components/@extended/IconButton';
import grafanaIcon from 'assets/images/icons/grafana_icon.svg';
import supersetIcon from 'assets/images/icons/superset_logo.png';

const MegaMenuSection = () => {
  const theme = useTheme();
  const iconBackColor = theme.palette.mode === 'dark' ? 'background.default' : 'grey.100';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={{ color: 'text.primary', bgcolor: iconBackColor, ml: 0.75 }}
      >
        <Avatar sx={{ width: 30, height: 30 }} src={grafanaIcon}></Avatar>
      </IconButton>
      <IconButton
        color="secondary"
        variant="light"
        sx={{ color: 'text.primary', bgcolor: iconBackColor, ml: 0.75 }}
      >
        <Avatar sx={{ width: 30, height: 30 }} src={supersetIcon}></Avatar>
      </IconButton>
    </Box>
  );
};

export default MegaMenuSection;
