import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Box, Grid, Stack, Accordion, AccordionDetails } from '@mui/material';
import MainCard from 'components/MainCard';
import BackLeft from 'assets/images/profile/UserProfileBackLeft';
import BackRight from 'assets/images/profile/UserProfileBackRight';
import { useState } from 'react';
import ProfileRadialChart from './ProfileRadialChart';
import chartMeta from '../../data/charts'
import ApexChart from 'sections/dashboard/analytics/apex';
import TrafficSources from './TrafficSources';

interface Props {
  focusInput: () => void;
}

const ClusterStatus = ({ focusInput }: Props) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(true);

  return (
    <Box
      sx={{
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
          <Stack spacing={0}>
            <MainCard border={false} content={false} sx={{ bgcolor: 'primary.lighter', position: 'relative' }}>
              <Box sx={{ position: 'absolute', bottom: '-7px', left: 0, zIndex: 1 }}>
                <BackLeft />
              </Box>
              <Grid container justifyContent="space-evenly" alignItems="center" sx={{ position: 'relative', zIndex: 5 }}>
                <Grid item>
                  <ProfileRadialChart />
                </Grid>
                <Grid item>
                  <TrafficSources />
                </Grid>
                <Grid item>
                  <ApexChart metadata={chartMeta.disk_line} {...{ shuffle: 'true' }} />
                </Grid>
                <Grid item>
                  <ApexChart metadata={chartMeta.disk_line} {...{ shuffle: 'true' }} />
                </Grid>
              </Grid>
              <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                <BackRight />
              </Box>
            </MainCard>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ClusterStatus;
