import { Box, Chip, Stack, Typography, Paper, Tooltip } from '@mui/material';
import MainCard from 'components/MainCard';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import globalConfig from 'data/initialConfig';

const AnalyticsDataCard = (props: any) => {
    const { color = 'primary', title, count, percentage, isLoss, children, description = '', id } = props;
    return <Paper elevation={globalConfig.elevation} sx={{ height: '100%', position: 'relative' }}>
        <Tooltip title={description}>
            <MainCard content={false} style={{ height: '100%' }}>
                <Box p={2.25} height="100%">
                    <Stack spacing={0.5} height="100%">
                        <Typography align='center' variant="h1" mb={2}>
                            {title}
                        </Typography>
                        <Stack direction="row" alignItems="center">
                            {count && <Typography variant="h4" color="inherit">
                                {count}
                            </Typography>}
                            {percentage && (
                                <Chip
                                    variant="combined"
                                    color={color}
                                    icon={
                                        <>
                                            {!isLoss && <RiseOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />}
                                            {isLoss && <FallOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />}
                                        </>
                                    }
                                    label={`${percentage}%`}
                                    sx={{ ml: 1.25, pl: 1 }}
                                    size="small"
                                />
                            )}
                        </Stack>
                        {children}
                    </Stack>
                </Box>
            </MainCard>
        </Tooltip>
    </Paper>
};

export default AnalyticsDataCard;
