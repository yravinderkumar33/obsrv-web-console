import MUIForm from "components/form";
import { useEffect, useState } from "react";
import * as _ from 'lodash';
import { Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addState } from "store/reducers/wizard";
import config from 'data/initialConfig';
import { updateDataset } from "services/dataset";
import { error } from "services/toaster";
const { spacing } = config;

const DataKeySelection = (props: any) => {
    const { id = "dataKey", description } = props;
    const dispatch = useDispatch();
    const existingState = useSelector((state: any) => _.get(state, ['wizard', 'pages', id]));
    const wizardState: any = useSelector((state: any) => state?.wizard);
    const jsonSchema = _.get(wizardState, 'pages.jsonSchema');

    const indexColumns = Object.entries(_.get(jsonSchema, ['schema', 'properties'])).map(([key, value]) => ({ label: _.capitalize(key), value: key }));
    const [value, subscribe] = useState<any>({});

    const pushStateToStore = (values: Record<string, any>) => dispatch(addState({ id, ...values }));
    const onSubmission = (value: any) => { };

    useEffect(() => {
        const updateIndexCol = async (timestampCol: string) => {
            try {
                const datasetConfig = _.get(wizardState, 'pages.datasetConfiguration.state.config');
                await updateDataset({ data: { dataset_config: { data_key: timestampCol }, ...datasetConfig } });
            } catch (err) {
                dispatch(error({ message: "Failed to update timestamp col" }));
            }
        }
        const dataKey = _.get(value, 'dataKey')
        dataKey && pushStateToStore({ dataKey });
        dataKey && updateIndexCol(dataKey);
    }, [value]);

    const fields = [
        {
            name: "dataKey",
            label: "Select Data key Field",
            type: 'select',
            required: true,
            selectOptions: indexColumns
        }
    ]

    return <>
        <Grid container rowSpacing={spacing} columnSpacing={spacing}>
            <Grid item xs={4}>
                <MUIForm initialValues={existingState || {}} subscribe={subscribe} onSubmit={(value: any) => onSubmission(value)} fields={fields} size={{ xs: 6 }} />
            </Grid>
        </Grid>
    </>
}

export default DataKeySelection;
