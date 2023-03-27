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
  const { type, options: meta, series: chartSeries, query = {} } = metadata;
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;
  const [options, setOptions] = useState<ChartProps>(meta);
  const [series, setSeries] = useState(chartSeries);
  const { step, interval } = rest;
  const [loading, setLoading] = useState(false);

  const fetchMetric = async (query: Record<string, any>) => {
    const interval = rest.interval || globalConfig.clusterMenu.interval;
    const step = rest.step || '1m';
    const { type, params = {}, noParams = false } = query;

    if (type === 'api') {
      try {
        setLoading(true);
        if (!noParams) {
          params.start = dayjs().subtract(interval, 'minutes').unix();
          params.end = dayjs().unix();
          if (step) {
            params.step = step;
          }
        }

        const metadata = { ...(interval && { interval }) };
        const seriesData = await fetchChartData(query, metadata);
        setSeries(seriesData);
      } catch (error) {
        setSeries([])
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

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      tooltip: {
        theme: mode === 'dark' ? 'dark' : 'light'
      },
      ...(!('colors' in meta) && {
        colors: [theme.palette.primary.main, theme.palette.primary[700]]
      })
    }));

    const interval = configureMetricFetcher(query);

    return () => {
      interval && clearInterval(interval)
    }

  }, [mode, primary, secondary, line, theme, step, interval, query]);

  return <>
    {loading && <Loader />}
    <ReactApexChart options={options} series={series} type={type} {...rest} />
  </>;
};

export default ApexChart;
