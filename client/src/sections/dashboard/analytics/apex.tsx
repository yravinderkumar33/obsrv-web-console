import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useConfig from 'hooks/useConfig';
import ReactApexChart, { Props as ChartProps } from 'react-apexcharts';
import _ from 'lodash'
import { fetchChartData } from 'services/clusterMetrics';
import globalConfig from 'data/initialConfig'

const ApexChart = (props: any) => {
  const { metadata, ...rest } = props;
  const theme = useTheme();
  const { mode } = useConfig();
  const { type, options: meta, series: chartSeries, query = {} } = metadata;
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;
  const [options, setOptions] = useState<ChartProps>(meta);
  const [series, setSeries] = useState(chartSeries);


  const fetchMetric = async (query: Record<string, any>) => {
    const { interval } = globalConfig.clusterMenu;
    const { type, params = {} } = query;

    if (type === 'api') {
      try {
        params.start = new Date(Date.now() - interval * 60000).toISOString();
        params.end = new Date().toISOString();
        const seriesData = await fetchChartData(query);
        setSeries(seriesData);
      } catch (error) {
        setSeries([])
      }
    }
  }

  const configureMetricFetcher = (query: Record<string, any>) => {
    const { frequency } = globalConfig.clusterMenu;
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

  }, [mode, primary, secondary, line, theme]);

  return <ReactApexChart options={options} series={series} type={type} {...rest} />;
};

export default ApexChart;
