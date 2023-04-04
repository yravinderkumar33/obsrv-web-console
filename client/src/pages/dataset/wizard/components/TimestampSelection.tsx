import MUIForm from "components/form";
import { useEffect, useMemo, useState } from "react";
import * as _ from 'lodash';
import { Alert, Grid } from "@mui/material";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { addState } from "store/reducers/wizard";

const TimestampSelection = (props: any) => {
    const { data, description } = props;
    const dispatch = useDispatch();
    const jsonSchema = useSelector((state: any) => state.jsonSchema);
    const indexColumns = _.map(_.get(jsonSchema, 'data.configurations.indexConfiguration.index'), col => ({ label: col, value: col }));
    const [value, subscribe] = useState<any>({});

    const pushStateToStore = (values: Record<string, any>) => dispatch(addState({ id: 'transformations', index: 1, state: { ...values } }));
    const onSubmission = (value: any) => { console.log({ value }) }

    useEffect(() => {
        if (_.get(value, 'indexCol')) {
            pushStateToStore(value);
        }
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
        <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={12}>
                <Alert color="info" icon={<InfoCircleOutlined />}>
                    {description}
                </Alert>
            </Grid>
            <Grid item xs={4}>
                <MUIForm initialValues={{}} subscribe={subscribe} onSubmit={(value: any) => onSubmission(value)} fields={fields} size={{ xs: 6 }} />
            </Grid>
        </Grid>
    </>
}


export default TimestampSelection