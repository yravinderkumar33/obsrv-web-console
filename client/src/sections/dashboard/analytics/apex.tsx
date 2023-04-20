import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import _ from 'lodash'
import { useTheme } from '@mui/material/styles';
import useConfig from 'hooks/useConfig';
import ReactApexChart, { Props as ChartProps } from 'react-apexcharts';
import { fetchChartData } from 'services/clusterMetrics';
import globalConfig from 'data/initialConfig';
import Loader from 'components/Loader';

const ApexChart = (props: any) => {
  const { metadata, ...rest } = props;
  const theme = useTheme();
  const { mode } = useConfig();
  const { type, options: meta, series: chartSeries, query = {}, queries } = metadata;
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;
  const [options, setOptions] = useState<ChartProps>(meta);
  const [series, setSeries] = useState(chartSeries);
  const { step, interval } = rest;
  const [loading, setLoading] = useState(false);

  const fetchMetric = async () => {
    const interval = rest.interval || globalConfig.clusterMenu.interval;
    const step = rest.step || '5m';
    const { params = {}, noParams = false } = query;
    try {
      setLoading(true);
      if (!noParams) {
        params.start = dayjs().subtract(interval, 'minutes').unix();
        params.end = dayjs().unix();
        if (step) {
          params.step = step;
        }
      }

      const metadata = props;
      const seriesData = await fetchChartData(query, metadata);
      setSeries(seriesData);
    } catch (error) {
      setSeries([])
    } finally {
      setLoading(false);
    }
  }

  const configureMetricFetcher = () => {
    const frequency = globalConfig.clusterMenu.frequency;
    fetchMetric();
    return setInterval(() => {
      fetchMetric();
    }, frequency * 1000)
  }

  useEffect(() => {
    const interval = configureMetricFetcher();
    return () => {
      interval && clearInterval(interval)
    }
  }, [interval]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      tooltip: {
        theme: mode === 'dark' ? 'dark' : 'light'
      }
    }));
  }, [mode, primary, secondary, line, theme]);

  return <>
    {loading && <Loader />}
    <ReactApexChart options={options} series={series} type={type} {...rest} />
  </>;
};

export default ApexChart;
