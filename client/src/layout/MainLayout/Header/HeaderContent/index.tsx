import { Box, Stack } from '@mui/material';
import Menus from './MenuSection'
import Notification from './Notification';

const HeaderContent = () => {
    return (
        <>
            <Box sx={{ ml: 1, width: '100%' }}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                    <Menus />
                    <Notification />
                </Stack>
            </Box>
        </>
    );
};

export default HeaderContent;
