import { useEffect, useState } from "react";
import { fetchDatasets } from "services/dataset";
import ApexWithFilters from "./ChartFilters";
import * as _ from 'lodash';
import filters from 'data/chartFilters';
import chartMeta from 'data/charts';
import ApexChart from "./apex";
import Loader from "components/Loader";
import { Grid } from "@mui/material";


const IngestionCharts = (props: any) => {
    const { chartName, title } = props;
    const [charts, setCharts] = useState<any>(null);

    const getLiveDatasets = async () => {
        try {
            return fetchDatasets({ data: { filters: { status: ['ACTIVE', 'DISABLED'] } } });
        } catch (error) {
            return []
        }
    }

    const getMetadata = (dataset: Record<string, any>) => {
        const id = _.get(dataset, 'dataset_id');
        const metadata = _.cloneDeep(_.get(chartMeta, [chartName]));
        _.set(metadata, 'query.body.query.filter.value', id);
        return [id, metadata];
    }

    const render = async () => {
        const liveDatasets = await getLiveDatasets();
        const chartMetadata = _.map(liveDatasets, getMetadata);
        setCharts(chartMetadata);
    }

    const renderChart = (payload: any) => {
        const [id, metadata] = payload;
        return <>
            <Grid item xs={6}>
                <ApexWithFilters title={`${title}- (${id})`} filters={_.get(filters, 'default')}>
                    <ApexChart metadata={metadata} interval={1140}></ApexChart>
                </ApexWithFilters>
            </Grid>
        </>
    }

    useEffect(() => {
        render();
    }, [])

    return <>
        <Grid container rowSpacing={1} columnSpacing={1} marginBottom={2}>
            {!charts && <Loader />}
            {charts && _.map(charts, renderChart)}
        </Grid>
    </>
}


export default IngestionCharts;