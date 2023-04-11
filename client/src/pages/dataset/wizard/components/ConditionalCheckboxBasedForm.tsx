import MUIForm from "components/form";
import * as _ from 'lodash';
import { Checkbox, FormControlLabel, FormGroup, Grid, Radio, Stack } from "@mui/material";
import { Alert } from "@mui/material";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import config from 'data/initialConfig';
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addState } from "store/reducers/wizard";
import { v4 } from "uuid";
import { saveConnectorDraft, updateTransformations } from "services/dataset";
import { error } from "services/toaster";
const { spacing } = config;

const ConditionalCheckboxForm = (props: any) => {

    const dispatch = useDispatch();
    const { id, type = "checkbox", justifyContents = 'flex-start', fields, name } = props;
    const onSubmission = (value: any) => { };
    const existingState: any = useSelector((state: any) => _.get(state, ['wizard', 'pages', id]) || ({}));
    const [childFormValue, setChildFormValues] = useState<any>({});
    const uuid = useMemo(() => existingState && existingState.value?.id || v4(), [existingState]);
    const configState: any = useSelector((state: any) => _.get(state, ['wizard', 'pages', 'datasetConfiguration', 'state', 'config']));

    const filterPredicate = (field: any) => {
        if (_.includes(_.get(existingState, 'formFieldSelection'), _.get(field, 'value'))) return true;
        if (_.get(field, ['selected']) === true) return true;
        return false;
    }

    const getInitialValues = () => {
        const selectedFields = _.filter(fields, filterPredicate);
        if (type === "checkbox") {
            return { [name]: _.map(selectedFields, 'value') }
        } else {
            return {
                [name]: _.get(_.last(selectedFields), 'value')
            }
        }
    }

    const persistState = (state: Record<string, any>) => dispatch(addState({ id, ...state }));
    const formik = useFormik({ initialValues: getInitialValues(), onSubmit: values => { } });
    const formValues = formik.values;
    const reset = () => persistState({});

    const persist = () => {
        const formFieldSelection = _.get(formValues, [name]);
        persistState({ formFieldSelection, value: { id: uuid, ...childFormValue } });
    }

    const saveConnectorInfo = async () => {
        const { id, type, ...rest }: any = childFormValue;
        const payload = {
            id: uuid,
            dataset_id: configState.id,
            connector_type: type,
            connector_config: { ...rest },
        }
        let data;
        if (existingState && existingState.value?.id) data = await updateTransformations(payload);
        else data = await saveConnectorDraft(payload);

        if (data.data) return null;
        else dispatch(error({ message: "Error occured saving the connector config" }));
    }

    const saveDebounced = _.debounce(saveConnectorInfo, 1000);

    useEffect(() => {
        if (_.difference(['type', 'topic', 'kafkaBrokers'], Object.keys(childFormValue)).length === 0 &&
            _.values(childFormValue).some(x => x !== '')
        )
            saveDebounced();
        persist();
    }, [formValues, childFormValue]);

    const getFormType = (metadata: Record<string, any>) => {
        const { name, value } = metadata;
        switch (type) {
            case "checkbox":
                return <Checkbox name={name} className="size-medium" checked={_.includes(_.get(formValues, name), value)} value={value} onChange={formik.handleChange} />
            case "radio":
                return <Radio name={name} className="size-medium" checked={value === _.get(formValues, name)} value={value} onChange={formik.handleChange} />
            default:
                return <Checkbox name={name} className="size-medium" value={value} onChange={formik.handleChange} />
        }
    }

    const renderFormControl = (option: Record<string, any>) => {
        const { name, value, label, disabled = false } = option;
        return <FormControlLabel key={`${name}-${value}`} name={name} disabled={disabled} control={getFormType(option)} label={label} />
    }

    const renderForm = () => <form onSubmit={formik.handleSubmit}>
        <FormGroup>
            <Stack direction="row" spacing={spacing} justifyContent={justifyContents}>
                {fields.map(renderFormControl)}
            </Stack>
        </FormGroup>
    </form>

    const renderAssociatedForm = () => {
        const value = _.get(formValues, [name]);
        const values = Array.isArray(value) ? value : [value];
        return _.map(values, (value: any) => {
            const metadata = _.find(fields, ['value', value]);
            if (!metadata) return null;
            const { form, description, component, value: type, ...rest } = metadata;
            return <>
                {description && <Grid item xs={12}> <Alert color="info" icon={<InfoCircleOutlined />}> {description}</Alert></Grid>}
                {form && (
                    <Grid item sm={12}>
                        <MUIForm
                            subscribe={setChildFormValues}
                            initialValues={{ type, ..._.get(existingState, 'value') }}
                            onSubmit={(value: any) => onSubmission(value)}
                            fields={form}
                            size={{ sm: 6, xs: 6, lg: 6 }}
                        />
                    </Grid>)
                }
                {component && <Grid item sm={12}> {component}</Grid>}
            </>
        })
    }

    return <>
        <Grid container rowSpacing={spacing}>
            <Grid item xs={12}>
                {renderForm()}
            </Grid>
            {renderAssociatedForm()}
        </Grid>
    </>
}

export default ConditionalCheckboxForm
