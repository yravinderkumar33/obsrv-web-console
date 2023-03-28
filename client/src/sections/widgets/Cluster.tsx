import { useTheme } from '@mui/material/styles';
import { Box, Grid, Stack, Accordion, AccordionDetails, Typography, Breadcrumbs } from '@mui/material';
import MainCard from 'components/MainCard';
import BackLeft from 'assets/images/profile/UserProfileBackLeft';
import BackRight from 'assets/images/profile/UserProfileBackRight';
import { useState } from 'react';
import chartMeta from '../../data/charts'
import ApexChart from 'sections/dashboard/analytics/apex';
import ClusterMetrics from './ClusterMetrics';
import globalConfig from 'data/initialConfig'
import ClusterNodes from './ClusterNodes';

const ClusterStatus = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  return (
    <Box
      sx={{
        width: '100%',
        '& .MuiAccordion-root': {
          zIndex: 0,
          borderColor: theme.palette.divider,
          '& .MuiAccordionSummary-root': {
            bgcolor: 'transparent',
            flexDirection: 'row'
          },
          '& .MuiAccordionDetails-root': {
            borderColor: theme.palette.divider
          },
          '& .Mui-expanded': {
            color: theme.palette.primary.main
          }
        }
      }}
    >
      <Accordion expanded={open} onChange={e => setOpen(!open)}>
        <AccordionDetails style={{ 'padding': '0px' }}>
          <Stack spacing={0} >
            <MainCard border={false} content={false} sx={{ bgcolor: 'primary.lighter', position: 'relative' }}>
              <Box sx={{ position: 'absolute', bottom: '-7px', left: 0, zIndex: 1 }}>
                <BackLeft />
              </Box>
              <Grid container justifyContent="center" alignItems="center" sx={{ position: 'relative', zIndex: 5 }}>
                <Grid item xs={2}>
                  <ClusterNodes />
                </Grid>
                <Grid item xs={2}>
                  <ClusterMetrics />
                </Grid>
                <Grid item xs={4}>
                  <ApexChart metadata={chartMeta.node_cpu} step={'30s'} />
                </Grid>
                <Grid item xs={4}>
                  <ApexChart metadata={chartMeta.node_memory} step={'30s'} />
                </Grid>
              </Grid>
              <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                <BackRight />
              </Box>
              <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                <Breadcrumbs aria-label="breadcrumb">
                  <Typography variant="h6">Interval: {globalConfig.clusterMenu.interval} Min</Typography>
                  <Typography variant="h6">Frequency: {globalConfig.clusterMenu.frequency} Sec</Typography>
                </Breadcrumbs>
              </Stack>
            </MainCard>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ClusterStatus;
