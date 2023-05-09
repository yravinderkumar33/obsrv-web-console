import MUIForm from "components/form";
import { useEffect, useState } from "react";
import * as _ from 'lodash';
import { Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import config from 'data/initialConfig';
import { addState } from "store/reducers/wizard";
import * as yup from "yup";
const { spacing } = config;

const ConditionalForm = (props: any) => {
    const dispatch = useDispatch();
    const { id, question, options, description, transform } = props;
    const existingState: any = useSelector((state: any) => _.get(state, ['wizard', 'pages', id]) || ({}));
    const { questionSelection, optionSelection } = existingState;
    const [response, subscribe] = useState<any>(questionSelection || {});
    const [childFormValue, setChildFormValues] = useState<any>(optionSelection || {});
    const [formErrors, subscribeErrors] = useState<any>(null);
    const selectedOption = _.get(response, _.get(question, 'name'));
    const onSubmission = (value: any) => { };
    const [config, setConfig] = useState<any>({});

    const selectForm = () => {
        const optionMeta = _.get(options, [selectedOption]);
        if (optionMeta) {
            const { form, description, size = { sm: 6, xs: 6, lg: 6 } } = optionMeta;
            const validations: any = {};
            const data = _.map(form, (item) => { validations[item.name] = item.validationSchema });
            const validationSchemas = yup.object().shape(validations);
            setConfig({ form, description, size, validationSchemas });
            return true;
        } else {
            setConfig({});
            subscribeErrors(null);
            return false;
        };
    }

    const persistState = (state: Record<string, any>, error?: any) => dispatch(addState({ id, ...state, error: error }));

    useEffect(() => {
        const data = selectForm();
        if (!data) {
            onSubmission({});
            persistState({ questionSelection: response, optionSelection: childFormValue }, false);
            return;
        }
        else {
            const dataPresent = _.map(childFormValue, (item: any) => item === '' || !item);
            if (!_.includes(dataPresent, true)) {
                subscribeErrors(null);
                persistState({ questionSelection: response, optionSelection: childFormValue }, false);
            } else {
                subscribeErrors({ 'error': true });
                persistState({ questionSelection: response, optionSelection: childFormValue }, { 'error': true });
            }
            return;
        }
    }, [selectedOption, childFormValue]);

    return <>
        <Grid container rowSpacing={spacing}>
            <Grid item xs={6}> <MUIForm initialValues={response} subscribe={subscribe} onSubmit={(value: any) => onSubmission(value)} fields={[question]} /></Grid>
            {_.get(config, 'form') ? (
                <Grid item sm={12}>
                    <MUIForm
                        subscribe={setChildFormValues}
                        initialValues={childFormValue}
                        onSubmit={(value: any) => onSubmission(value)}
                        fields={_.get(config, 'form')}
                        size={_.get(config, 'size')}
                        validationSchema={_.get(config, 'validationSchemas')}
                        subscribeErrors={subscribeErrors}
                    />
                </Grid>
            ) : null}
        </Grid>
    </>
}

export default ConditionalForm
