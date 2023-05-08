import MUIForm from "components/form";
import { useEffect, useState } from "react";
import * as _ from 'lodash';
import { Checkbox, FormControlLabel, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addState } from "store/reducers/wizard";
import config from 'data/initialConfig';
import { updateDataset } from "services/dataset";
import { error } from "services/toaster";
import * as yup from "yup";
const { spacing } = config;

const TimestampSelection = (props: any) => {
    const { id = "timestamp", description } = props;
    const dispatch = useDispatch();
    const existingState = useSelector((state: any) => _.get(state, ['wizard', 'pages', id]));
    const wizardState: any = useSelector((state: any) => state?.wizard);
    const jsonSchema = _.get(wizardState, 'pages.jsonSchema');
    const jsonSchemaCols = _.get(wizardState, 'pages.columns.state.schema') || [];
    const indexColumns = Object.entries(_.get(jsonSchema, 'configurations.indexConfiguration.index')).map(([key, value]) => ({ label: value, value: key }));
    const [value, subscribe] = useState<any>({});
    const [showAllFields, setShowAllFields] = useState<boolean>(false);

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

    const getIndexColumns = (all?: boolean) => {
        if (all) {
            const data = _.map(jsonSchemaCols, (schema: any) => {
                const name = _.get(schema, 'column');
                return { label: name, value: name };
            });
            return [...data];
        }
        if (indexColumns) return indexColumns;
    }

    const fields = [
        {
            name: "indexCol",
            label: "Select Timestamp Field",
            type: 'autocomplete',
            required: true,
            selectOptions: getIndexColumns(showAllFields),
        }
    ];

    const validationSchema = yup.object().shape({
        indexCol: yup.string().required("This field is required"),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setShowAllFields(e.target?.checked);
    }

    return <>
        <Grid container rowSpacing={spacing} columnSpacing={spacing}>
            <Grid item xs={4}>
                <MUIForm
                    initialValues={existingState || {}}
                    subscribe={subscribe}
                    onSubmit={(value: any) => onSubmission(value)}
                    fields={fields}
                    size={{ xs: 6 }}
                    validationSchema={validationSchema}
                />
            </Grid>
            <Grid item xs={4}>
                <FormControlLabel label='Show All Fields'
                    control={<Checkbox className="size-medium" checked={showAllFields} onChange={handleChange} />}
                />
            </Grid>
        </Grid>
    </>
}

export default TimestampSelection;
