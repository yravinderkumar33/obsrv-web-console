import { useTheme } from '@mui/material/styles';
import { Box, Avatar, Tooltip } from '@mui/material';
import IconButton from 'components/@extended/IconButton';
import grafanaIcon from 'assets/images/icons/grafana_icon.svg';
import supersetIcon from 'assets/images/icons/superset_logo.png';
import { useMemo } from 'react';

const MegaMenuSection = () => {

    const navigate = (path: any) => {
        if (path) {
            window.open(path);
        }
    }

    const buttons = useMemo(() => [
        {
            icon: grafanaIcon,
            tooltip: 'Navigate to Grafana Dashboard',
            url: process.env.REACT_APP_GRAFANA_URL
        },
        {
            icon: supersetIcon,
            tooltip: 'Navigate to Superset Dashboard',
            url: process.env.REACT_APP_SUPERSET_URL
        }
    ], []);

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            {
                buttons.map((button, index) => {
                    return <Tooltip title={button.tooltip} key={index}>
                        <IconButton 
                         data-edataid="icon:navigation"
                        color="secondary" variant="light" sx={{ color: 'text.primary', bgcolor: 'transparent', ml: 0.75 }} onClick={_ => navigate(button.url)}>
                            <Avatar sx={{ width: 30, height: 30 }} src={button.icon}></Avatar>
                        </IconButton>
                       
                    </Tooltip>
                })
            }
        </Box>
    );
};

export default MegaMenuSection;
