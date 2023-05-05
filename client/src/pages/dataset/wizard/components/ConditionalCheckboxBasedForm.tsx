import MUIForm from "components/form";
import * as _ from 'lodash';
import { Checkbox, FormControlLabel, FormGroup, Grid, Radio, Stack } from "@mui/material";
import { Alert } from "@mui/material";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import config from 'data/initialConfig';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addState } from "store/reducers/wizard";
import interactIds  from "data/telemetry/interact.json";
const { spacing } = config;

const ConditionalCheckboxForm = (props: any) => {

    const dispatch = useDispatch();
    const { id, type = "checkbox", justifyContents = 'flex-start', fields, name } = props;
    const onSubmission = (value: any) => { };
    const existingState: any = useSelector((state: any) => _.get(state, ['wizard', 'pages', id]) || ({}));
    const [childFormValue, setChildFormValues] = useState<any>({});

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

    const persist = () => {
        const formFieldSelection = _.get(formValues, [name]);
        persistState({ formFieldSelection, value: { ...childFormValue } });
    }

    useEffect(() => {
        persist();
    }, [formValues, childFormValue]);

    const handleParentFormChange = (e: any) => {
        formik.handleChange(e);
        setChildFormValues({});
    }

    const getFormType = (metadata: Record<string, any>) => {
        const { name, value } = metadata;
        switch (type) {
            case "checkbox":
                return <Checkbox 
                data-edataid={interactIds.add_dataset_transformation}
                data-objectid={`buttonCheckbox-${value}`}
                data-objecttype="dataset"
                name={name} className="size-medium" checked={_.includes(_.get(formValues, name), value)} value={value} onChange={handleParentFormChange} />
            case "radio":
                return <Radio 
                data-edataid={interactIds.add_dataset_transformation}
                data-objectid={`buttonRadio-${value}`}
                data-objecttype="dataset"
                name={name} className="size-medium" checked={value === _.get(formValues, name)} value={value} onChange={handleParentFormChange} />
            default:
                return <Checkbox
                data-edataid={interactIds.add_dataset_transformation}
                data-objectid={`buttonCheckbox-${value}`}
                data-objecttype="dataset"
                name={name} className="size-medium" value={value} onChange={handleParentFormChange} />
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
                {description && <Grid key={Math.random()} item xs={12}> <Alert sx={{ alignItems: 'center' }} color="info" icon={<InfoCircleOutlined />}> {description}</Alert></Grid>}
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
