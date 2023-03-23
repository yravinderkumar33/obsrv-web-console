import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useConfig from 'hooks/useConfig';
import ReactApexChart, { Props as ChartProps } from 'react-apexcharts';
import _ from 'lodash'
import { fetchChartData } from 'services/clusterMetrics';
import globalConfig from 'data/initialConfig';
import dayjs from 'dayjs';
import Loader from 'components/Loader';


const BrushChart = (props: any) => {
  const { metadata, ...rest } = props;
  const theme = useTheme();
  const { mode } = useConfig();
  const { primary: primaryChart, secondary: secondaryChart, query = {}, } = metadata;
  const { type: primaryType, options: primaryOptions, series: primarySeries, height: heightPrimary } = primaryChart;
  const { type: secondaryType, options: secondaryOptions, series: secondarySeries, height: heightSecondary } = secondaryChart;
  const [loading, setLoading] = useState(false);

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [primaryChartOptions, setPrimaryChartOptions] = useState<ChartProps>(primaryOptions);
  const [primaryChartSeries, setPrimaryChartSeries] = useState(primarySeries);

  const [secondaryChartOptions, setSecondaryChartOptions] = useState<ChartProps>(secondaryOptions);
  const [secondaryChartSeries, setSecondaryChartSeries] = useState(secondarySeries);

  const fetchMetric = async (query: Record<string, any>) => {
    const interval = rest.interval || globalConfig.clusterMenu.interval;
    const { type, params = {} } = query;
    if (type === 'api') {
      try {
        setLoading(true);
        params.start = dayjs().subtract(interval, 'minutes').unix();
        params.end = dayjs().unix();
        const seriesData = await fetchChartData(query);
        setPrimaryChartSeries(seriesData);
        setSecondaryChartSeries(seriesData);
      } catch (error) {
        setPrimaryChartSeries([]);
        setSecondaryChartSeries([]);
      } finally {
        setLoading(false);
      }
    }
  }

  const configureMetricFetcher = (query: Record<string, any>) => {
    const frequency = rest?.frequency || globalConfig.clusterMenu.frequency;
    fetchMetric(query);
    return setInterval(() => {
      fetchMetric(query);
    }, frequency * 1000)
  }

  const setDefaultOptions = (prevState: any) => ({
    ...prevState,
    tooltip: {
      theme: mode === 'dark' ? 'dark' : 'light'
    }
  });

  useEffect(() => {
    setPrimaryChartOptions(setDefaultOptions);
    setSecondaryChartOptions(setDefaultOptions);
    const interval = configureMetricFetcher(query);

    return () => {
      interval && clearInterval(interval)
    }
  }, [mode, primary, secondary, line, theme]);

  return <div id="wrapper">
    {loading && <Loader />}
    <div id="chart-line2">
      <ReactApexChart options={primaryChartOptions} series={primaryChartSeries} type={primaryType} height={heightPrimary} {...rest} />
    </div>
    <div id="chart-line">
      <ReactApexChart options={secondaryChartOptions} series={secondaryChartSeries} type={secondaryType} height={heightSecondary} {...rest} />
    </div>
  </div>
};

export default BrushChart;
