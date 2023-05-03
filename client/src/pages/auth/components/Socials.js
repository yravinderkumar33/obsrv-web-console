
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Button, Stack } from '@mui/material';
import socialButtons from 'data/login/socialButtons';

const Social = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
 
    return (
        <Stack
            direction="column"
            spacing={matchDownSM ? 1 : 2}
            justifyContent={matchDownSM ? 'space-around' : 'space-between'}
            sx={{ '& .MuiButton-startIcon': { mr: matchDownSM ? 0 : 1, ml: matchDownSM ? 0 : -0.5 } }}
        >
           {socialButtons.map((option) => (
                                <Button
                                            key={option.value}
                                            variant="outlined"
                                            color="secondary"
                                            sx={{height: 45}}
                                            fullWidth={!matchDownSM}
                                            startIcon={option.icon}
                                            onClick={option.onClick}
                                        >
                                            {/* {!matchDownSM && 'Facebook'} */}
                                            {!matchDownSM && option.label}
                                        </Button>
                            ))}
        </Stack>
    );
};

export default Social;
