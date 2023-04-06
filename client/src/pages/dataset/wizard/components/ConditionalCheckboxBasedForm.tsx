import MUIForm from "components/form";
import { useEffect } from "react";
import * as _ from 'lodash';
import { Checkbox, FormControlLabel, FormGroup, Grid, Radio, Stack } from "@mui/material";
import { Alert } from "@mui/material";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useFormik } from "formik";

const ConditionalCheckboxForm = (props: any) => {
    const { type = "checkbox", justifyContents = 'flex-start', fields, name } = props;
    const onSubmission = (value: any) => { console.log({ value }) };

    const getInitialValues = () => {
        const selectedFields = _.filter(fields, ['selected', true]);
        if (type === "checkbox") {
            return { [name]: _.map(selectedFields, 'value') }
        } else {
            return {
                [name]: _.get(_.last(selectedFields), 'value')
            }
        }
    }

    const formik = useFormik({
        initialValues: getInitialValues(),
        onSubmit: values => console.log(values),
    });

    const formValues = formik.values;

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

    const renderSubSection = (option: Record<string, any>) => {
        const { name, value, label, disabled = false } = option;
        return <FormControlLabel key={`${name}-${value}`} name={name} disabled={disabled} control={getFormType(option)} label={label} />
    }

    const renderForm = () => <form onSubmit={formik.handleSubmit}>
        <FormGroup>
            <Stack direction="row" spacing={2} justifyContent={justifyContents}>
                {fields.map(renderSubSection)}
            </Stack>
        </FormGroup>
    </form>

    const renderAssociatedForm = () => {
        const value = _.get(formValues, [name]);
        const values = Array.isArray(value) ? value : [value];
        return _.map(values, (value: any) => {
            const metadata = _.find(fields, ['value', value]);
            if (!metadata) return null;
            const { form, description } = metadata;
            return <>
                {description && <Grid item xs={12}> <Alert color="info" icon={<InfoCircleOutlined />}> {description}</Alert></Grid>}
                {form && <Grid item sm={12}> <MUIForm initialValues={{}} onSubmit={(value: any) => onSubmission(value)} fields={form} size={{ sm: 6, xs: 6, lg: 6 }} /></Grid>}
            </>
        })
    }

    return <>
        <Grid container rowSpacing={2}>
            <Grid item xs={12}>
                {renderForm()}
            </Grid>
            {renderAssociatedForm()}
        </Grid>
    </>
}

export default ConditionalCheckboxForm