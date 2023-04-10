import MUIForm from "components/form";
import { useEffect, useState } from "react";
import * as _ from 'lodash';
import { Grid } from "@mui/material";
import { Alert } from "@mui/material";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import config from 'data/initialConfig';
const { spacing } = config;

const ConditionalForm = (props: any) => {
    const { question, options, description, transform } = props;
    const [response, subscribe] = useState<any>({});
    const selectedOption = _.get(response, _.get(question, 'name'));
    const onSubmission = (value: any) => { console.log({ value }) };
    const [config, setConfig] = useState<any>({});
    const [initialValue, setInitialValue] = useState<Record<string, any>>({});
    const redux = useSelector((state: any) => state);

    const selectForm = (optionMeta: Record<string, any>) => {
        if (optionMeta) {
            const { form, description, size = { sm: 6, xs: 6, lg: 6 } } = optionMeta;
            setConfig({ form, description, size });
        }
    }

    useEffect(() => {
        const optionMeta = _.get(options, [selectedOption]);
        selectForm(optionMeta);
    }, [selectedOption]);

    return <>
        <Grid container rowSpacing={spacing}>
            {description && <Grid item xs={12}> <Alert color="info" icon={<InfoCircleOutlined />}> {description}</Alert></Grid>}
            <Grid item xs={6}>
                <MUIForm initialValues={{}} subscribe={subscribe} onSubmit={(value: any) => onSubmission(value)} fields={[question]} />
            </Grid>
            {_.get(config, 'description') && <Grid item xs={12}> <Alert color="info" icon={<InfoCircleOutlined />}> {_.get(config, 'description')}</Alert></Grid>}
            {_.get(config, 'form') ? <Grid item sm={12}> <MUIForm initialValues={{}} onSubmit={(value: any) => onSubmission(value)} fields={_.get(config, 'form')} size={_.get(config, 'size')} /></Grid> : null}
        </Grid>
    </>
}

export default ConditionalForm