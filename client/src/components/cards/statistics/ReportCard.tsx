import { Grid, Stack, Typography, useTheme } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { fetchChartData } from 'services/clusterMetrics';
import { GenericCardProps } from 'types/root';
import globalConfig from 'data/initialConfig';
import * as _ from 'lodash';
import { Paper } from '@mui/material';

interface ReportCardProps extends GenericCardProps { }

const ReportCard = ({ primary, suffix, secondary, iconPrimary, color, query }: ReportCardProps) => {
  const theme = useTheme();
  const IconPrimary = iconPrimary!;
  const primaryIcon = iconPrimary ? <IconPrimary fontSize="large" /> : null;
  const [primaryLabel, setPrimaryLabel] = useState<any>(primary);
  const [colorType, setColorType] = useState("primary");

  const fetchData = async () => {
    const { type } = query;
    if (type === 'api') {
      try {
        const seriesData = await fetchChartData(query);
        if (Array.isArray(seriesData)) {
          const [data, color] = seriesData;
          setPrimaryLabel(data);
          color && setColorType(color);
        } else {
          setPrimaryLabel(seriesData);
        }
      } catch (error) { }
    }
  }

  const configureMetricFetcher = () => {
    const frequency = globalConfig.clusterMenu.frequency;
    fetchData();
    return setInterval(() => {
      fetchData();
    }, frequency * 1000)
  }

  useEffect(() => {
    const interval = query && configureMetricFetcher();
    return () => interval && clearInterval(interval);
  }, [])

  return (
    <Paper elevation={globalConfig.elevation}>
      <MainCard>
        <Grid container justifyContent="space-between" alignItems="center" color={_.get(theme, ['palette', colorType, 'dark'])}>
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
    </Paper>
  );
};

export default ReportCard;
