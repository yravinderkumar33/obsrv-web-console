import { useTheme } from '@mui/material/styles';
import { Box, Avatar, Tooltip } from '@mui/material';
import IconButton from 'components/@extended/IconButton';
import grafanaIcon from 'assets/images/icons/grafana_icon.svg';
import supersetIcon from 'assets/images/icons/superset_logo.png';
import { useMemo } from 'react';

const MegaMenuSection = () => {
  const theme = useTheme();
  const iconBackColor = theme.palette.mode === 'dark' ? 'background.default' : 'grey.100';


  const buttons = useMemo(() => [
    {
      icon: grafanaIcon,
      tooltip: 'Navigate to Grafana Dashboard'
    },
    {
      icon: supersetIcon,
      tooltip: 'Navigate to Superset Dashboard'
    }
  ], [])

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      {
        buttons.map((button, index) => {
          return <Tooltip title={button.tooltip} key={index}>
            <IconButton color="secondary" variant="light" sx={{ color: 'text.primary', bgcolor: iconBackColor, ml: 0.75 }}>
              <Avatar sx={{ width: 30, height: 30 }} src={button.icon}></Avatar>
            </IconButton>
          </Tooltip>
        })
      }
    </Box>
  );
};

export default MegaMenuSection;
