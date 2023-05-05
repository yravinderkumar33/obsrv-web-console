import MUIForm from "components/form";
import { useEffect, useState } from "react";
import * as _ from 'lodash';
import { Alert, Grid } from "@mui/material";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { addState } from "store/reducers/wizard";
import config from 'data/initialConfig';
import { updateDataset } from "services/dataset";
import { error } from "services/toaster";
const { spacing } = config;

const TimestampSelection = (props: any) => {
    const { id = "timestamp", description } = props;
    const dispatch = useDispatch();
    const existingState = useSelector((state: any) => _.get(state, ['wizard', 'pages', id]));
    const wizardState: any = useSelector((state: any) => state?.wizard);
    const jsonSchema = _.get(wizardState, 'pages.jsonSchema');

    const indexColumns = Object.entries(_.get(jsonSchema, 'configurations.indexConfiguration.index')).map(([key, value]) => ({ label: value, value: key }));
    const [value, subscribe] = useState<any>({});

    const pushStateToStore = (values: Record<string, any>) => dispatch(addState({ id, ...values }));
    const onSubmission = (value: any) => { };

    useEffect(() => {
        const updateIndexCol = async (timestampCol: string) => {
            try {
                const datasetConfig = _.get(wizardState, 'pages.datasetConfiguration.state.config');
                await updateDataset({ data: { dataset_config: { timestamp_key: timestampCol }, ...datasetConfig } });
            } catch (err) {
                dispatch(error({ message: "Failed to update timestamp col" }));
            }
        }
        const indexCol = _.get(value, 'indexCol')
        indexCol && pushStateToStore({ indexCol });
        indexCol && updateIndexCol(indexCol);
    }, [value]);

    const fields = [
        {
            name: "indexCol",
            label: "Select Timestamp Field",
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

export default TimestampSelection;
