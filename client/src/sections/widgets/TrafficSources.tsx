// material-ui
import { Grid, LinearProgress, Typography } from '@mui/material';

// project imports
import MainCard from 'components/MainCard';

// ===========================|| DATA WIDGET - TRAFFIC SOURCES ||=========================== //

const TrafficSources = () => (
  <MainCard style={{ 'background': 'inherit' }}
    title=""
  >
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item sm zeroMinWidth>
            <Typography variant="body2">CPU</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" align="right">
              40%
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <LinearProgress variant="determinate" value={40} color="primary" />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item sm zeroMinWidth>
            <Typography variant="body2">Memory</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" align="right">
              58%
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <LinearProgress variant="determinate" value={58} color="secondary" />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item sm zeroMinWidth>
            <Typography variant="body2">Disk</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" align="right">
              80%
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <LinearProgress variant="determinate" value={80} color="primary" />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </MainCard>
);

export default TrafficSources;
