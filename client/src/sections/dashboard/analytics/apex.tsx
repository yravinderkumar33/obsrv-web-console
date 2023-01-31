import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useConfig from 'hooks/useConfig';
import ReactApexChart, { Props as ChartProps } from 'react-apexcharts';
import _ from 'lodash'

const ApexChart = (props: any) => {
  const { metadata, ...rest } = props;
  const theme = useTheme();
  const { mode } = useConfig();
  const { type, options: meta, series: chartSeries } = metadata
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;
  const [options, setOptions] = useState<ChartProps>(meta);
  const [series, setSeries] = useState(chartSeries);

  const shuffle = () => {
    let updatedSeries = _.cloneDeep(chartSeries);
    return setInterval(() => {
      if (_.get(updatedSeries, '[0].data')) {
        updatedSeries = updatedSeries.map((series: any) => {
          const data = _.shuffle(series.data)
          return { ...series, data }
        })
      } else {
        updatedSeries = _.shuffle(updatedSeries)
      }
      setSeries(updatedSeries)
    }, 2000)
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

    let interval: any;
    if ('shuffle' in props) {
      interval = shuffle()
    }

    return () => {
      interval && clearInterval(interval)
    }

  }, [mode, primary, secondary, line, theme]);


  return <ReactApexChart options={options} series={series} type={type} {...rest} />;
};

export default ApexChart;
