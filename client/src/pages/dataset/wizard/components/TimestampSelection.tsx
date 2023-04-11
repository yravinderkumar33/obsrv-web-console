import MUIForm from "components/form";
import { useEffect, useState } from "react";
import * as _ from 'lodash';
import { Alert, Grid } from "@mui/material";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { addState } from "store/reducers/wizard";
import config from 'data/initialConfig';
const { spacing } = config;

const TimestampSelection = (props: any) => {
    const { id = "timestamp", description } = props;
    const dispatch = useDispatch();
    const existingState = useSelector((state: any) => _.get(state, ['wizard', 'pages', id]));
    const wizardState: any = useSelector((state: any) => state?.wizard);
    const jsonSchema = _.get(wizardState, 'pages.jsonSchema');

    const indexColumns = _.map(_.get(jsonSchema, 'configurations.indexConfiguration.index'), col => ({ label: col, value: col }));
    const [value, subscribe] = useState<any>({});

    const pushStateToStore = (values: Record<string, any>) => dispatch(addState({ id, ...values }));
    const onSubmission = (value: any) => { };

    useEffect(() => {
        const indexCol = _.get(value, 'indexCol')
        indexCol && pushStateToStore({ indexCol });
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
            <Grid item xs={12}>
                <Alert color="info" icon={<InfoCircleOutlined />}>
                    {description}
                </Alert>
            </Grid>
            <Grid item xs={4}>
                <MUIForm initialValues={existingState || {}} subscribe={subscribe} onSubmit={(value: any) => onSubmission(value)} fields={fields} size={{ xs: 6 }} />
            </Grid>
        </Grid>
    </>
}

export default TimestampSelection
