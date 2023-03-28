import { useEffect, useState } from 'react';
import Chart from 'react-gauge-chart'
import { v4 } from 'uuid'
import globalConfig from 'data/initialConfig';
import { fetchChartData } from 'services/clusterMetrics';

const GaugeChart = (props: any) => {
    const { textColor = 'black', nrOfLevels = 100, arcsLength = [80, 10, 10], colors = ['#5BE12C', '#F5CD19', '#EA4228'], query = {}, ...rest } = props
    const [percent, setPercent] = useState(0);

    const fetchMetrics = async () => {
        try {
            const percent = await fetchChartData(query as any);
            setPercent((percent as any) * 0.01);
        } catch (error) {
            console.log(error);
        }
    }

    const configureMetricFetcher = () => {
        const frequency = rest?.frequency || globalConfig.clusterMenu.frequency;
        fetchMetrics();
        return setInterval(() => {
            fetchMetrics();
        }, frequency * 1000)
    }

    useEffect(() => {
        configureMetricFetcher();
    }, [])

    return <>
        <Chart id={v4()}
            nrOfLevels={nrOfLevels}
            arcsLength={arcsLength}
            colors={colors}
            percent={percent}
            textColor={textColor}
            needleColor={'#6a727a'}
        />
    </>
}

export default GaugeChart