import { Box, Chip, Stack, Typography, Paper, Tooltip } from '@mui/material';
import MainCard from 'components/MainCard';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import globalConfig from 'data/initialConfig';
import { interactIds } from 'data/telemetry/interactIds';

const AnalyticsDataCard = (props: any) => {
  const { color = 'primary', title, count, percentage, isLoss, children, description = '', id } = props;
  return <Paper elevation={globalConfig.elevation} sx={{ height: '100%' }}>
    <Tooltip title={description}>
      <MainCard content={false} style={{ height: '100%' }}>
        <Box sx={{ p: 2.25 }}>
          <Stack spacing={0.5}>
            <Typography align='center' variant="h6" color="textSecondary">
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
