import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useConfig from 'hooks/useConfig';
import ReactApexChart, { Props as ChartProps } from 'react-apexcharts';

// ==============================|| USER CARD CHART ||============================== //

const CircularGauge = () => {
  const theme = useTheme();
  const { mode } = useConfig();

  // chart options
  const areaChartOptions = {
    chart: {
      height: 280,
      type: 'radialBar',
    },
    labels: ["Progress"]
  };

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState<ChartProps>(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      tooltip: {
        theme: mode === 'dark' ? 'dark' : 'light'
      }
    }));
  }, [mode, primary, secondary, line, theme]);

  const [series] = useState([67]);

  return <ReactApexChart options={options} series={series} type="radialBar" />;
};

export default CircularGauge;
