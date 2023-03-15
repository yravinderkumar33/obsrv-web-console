import { Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { fetchChartData } from 'services/clusterMetrics';
import { GenericCardProps } from 'types/root';

interface ReportCardProps extends GenericCardProps { }

const ReportCard = ({ primary, suffix, secondary, iconPrimary, color, query }: ReportCardProps) => {
  const IconPrimary = iconPrimary!;
  const primaryIcon = iconPrimary ? <IconPrimary fontSize="large" /> : null;
  const [primaryLabel, setPrimaryLabel] = useState<any>(primary);

  const fetchData = async () => {
    const { type, params = {} } = query;
    if (type === 'api') {
      try {
        const seriesData = await fetchChartData(query);
        setPrimaryLabel(seriesData);
      } catch (error) {
      }
    }
  }

  useEffect(() => {
    query && fetchData();
  }, [])

  return (
    <MainCard>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Stack spacing={1}>
            <Typography variant="h4">
              {primaryLabel} {suffix}
            </Typography>
            <Typography variant="body1" color="secondary">
              {secondary}
            </Typography>
          </Stack>
        </Grid>
        <Grid item>
          <Typography variant="h2" style={{ color }}>
            {primaryIcon}
          </Typography>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default ReportCard;
