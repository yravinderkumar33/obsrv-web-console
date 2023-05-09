import {
    Stack, IconButton, Typography, Box, DialogActions,
    DialogContent, DialogTitle,
} from "@mui/material";
import MUIForm from "components/form";
import { useMemo, useState } from "react";
import * as _ from 'lodash';
import { useDispatch } from "react-redux";
import { addState } from "store/reducers/wizard";
import { v4 } from "uuid";
import { saveTransformations } from "services/dataset";
import { error } from "services/toaster";
import  interactIds  from "data/telemetry/interact.json";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import * as yup from "yup";
import { StandardWidthButton } from "components/styled/Buttons";

const AddPIIDialog = (props: any) => {
    const { id, data, onClose, selection, setSelection, actions, mainDatasetId } = props;
    const [value, subscribe] = useState<any>({});
    const dispatch = useDispatch();
    const [errors, subscribeErrors] = useState<any>(null);

    const filteredData = _.filter(data, payload => {
        if (_.find(selection, ['column', _.get(payload, 'column')])) return false;
        return true
    });

    const transformDataPredicate = (payload: Record<string, any>) => ({ label: _.get(payload, 'column'), value: _.get(payload, 'column') });
    const columns = useMemo(() => _.map(filteredData, transformDataPredicate), [data]);

    const onSubmission = (value: any) => { };
    const pushStateToStore = (values: Record<string, any>) => dispatch(addState({ id, ...values }));

    const saveTransformation = async (payload: any, updateStateData: any) => {
        const dispatchError = () => dispatch(error({ message: "Error occured saving the transformation config" }));
        try {
            const data = await saveTransformations(payload);
            if (data.data)
                setSelection((preState: Array<any>) => {
                    const updatedState = [...preState, updateStateData];
                    pushStateToStore({ selection: updatedState });
                    return updatedState;
                });
            else dispatchError();
        } catch (err) {
            dispatchError();
        }
    }

    const updatePIIMeta = () => {
        onSubmission({});
        if (_.keys(errors).length > 0) { return; }
        const { column, transformation } = value;
        const targetColumn = _.find(data, ['column', column]);
        if (targetColumn) {
            const uuid = v4();
            const updatedColumnMetadata = { ...targetColumn, isModified: true, _transformationType: transformation, id: uuid };
            saveTransformation({
                id: uuid,
                field_key: column,
                transformation_function: {
                    type: transformation,
                    expr: column,
                    condition: null
                },
                dataset_id: mainDatasetId,
            }, updatedColumnMetadata);
            onClose();
        }
    }

    const fields = [
        {
            name: "column",
            label: "Select Field",
            type: 'autocomplete',
            required: true,
            selectOptions: columns
        },
        {
            name: "transformation",
            label: "Select Transformation",
            type: 'radio',
            required: true,
            selectOptions: actions
        }
    ];

    const validationSchema = yup.object().shape({
        column: yup.string().required("This field is required"),
        transformation: yup.string().required("This field is required"),
    });

    return <>
        <Box sx={{ p: 1, py: 1.5, width: '50vw', maxWidth: "100%", }}>
            <DialogTitle component={Box} display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h5">
                    Add PII Field
                </Typography>
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        data-edataid={interactIds.sidebar_close}
                        data-objectid="closeOutlined:addPII"
                        data-objecttype="dataset"
                        onClick={onClose}
                        sx={{
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseOutlinedIcon />
                    </IconButton>
                ) : null}
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} my={1}>
                    <MUIForm
                        initialValues={{}}
                        subscribe={subscribe}
                        onSubmit={(value: any) => onSubmission(value)}
                        fields={fields}
                        size={{ xs: 12 }}
                        validationSchema={validationSchema}
                        subscribeErrors={subscribeErrors}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 4 }}>
                <StandardWidthButton
                    data-edataid={interactIds.add_dataset_pii}
                    data-objectid={value}
                    data-objecttype="dataset"
                    variant="contained"
                    onClick={_ => updatePIIMeta()}
                    size="large"
                    sx={{ width: 'auto' }}
                >
                    <Typography variant="h5">
                        Add
                    </Typography>
                </StandardWidthButton>
            </DialogActions>
        </Box></>
}

export default AddPIIDialog;
