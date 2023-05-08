import {
    IconButton, Popover, Typography,
    Box, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import MUIForm from "components/form";
import { useMemo, useState } from "react";
import * as _ from 'lodash';
import { useDispatch } from "react-redux";
import { addState } from "store/reducers/wizard";
import { Stack } from "@mui/material";
import { saveTransformations } from "services/dataset";
import { error } from "services/toaster";
import { v4 } from "uuid";
import { interactIds } from "data/telemetry/interactIds";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import JSONataPlayground from "components/JSONataPlayground";
import * as yup from "yup";
import { StandardWidthButton } from "components/styled/Buttons";

const AddTransformationExpression = (props: any) => {
    const { id, data, onClose, selection, setSelection, actions, mainDatasetId } = props;
    const dispatch = useDispatch();
    const [value, subscribe] = useState<any>({});
    const filteredData = _.filter(data, payload => {
        if (_.find(selection, ['column', _.get(payload, 'column')])) return false;
        return true
    });
    const [evaluationData, setEvaluationData] = useState<string>('');
    const [transformErrors, setTransformErrors] = useState<boolean>(false);
    const [updateValues, setUpdateValues] = useState<any>(null);
    const [formErrors, subscribeErrors] = useState<any>(null);

    const transformDataPredicate = (payload: Record<string, any>) => ({ label: _.get(payload, 'column'), value: _.get(payload, 'column') });
    const columns = useMemo(() => _.map(filteredData, transformDataPredicate), [data]);

    const pushStateToStore = (values: Record<string, any>) => dispatch(addState({ id, ...values }));
    const onSubmission = (value: any) => { };
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);

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
            selectOptions: actions,
        },
        {
            name: "expression",
            label: "Add Custom Expression",
            type: 'text',
            dependsOn: {
                key: "transformation",
                value: "custom"
            },
            required: true,
            helperText: <>
                Ex: $sum(Product.(Price * Quantity)) <br /> FirstName & " " & Surname
            </>,
        }
    ];

    const validationSchema = yup.object().shape({
        column: yup.string().required("This field is required"),
        transformation: yup.string().required("This field is required"),
        expression: yup.string().when(
            'transformation', {
            is: 'custom',
            then: yup.string().required("This field is required"),
        }),
    });

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

    const updateTransformation = () => {
        onSubmission({});
        if (_.keys(formErrors).length > 0) { return; }
        const { column, transformation, expression } = value;
        const targetColumn = _.find(data, ['column', column]);
        if (targetColumn) {
            const uuid = v4();
            let updatedMeta: Record<string, any> = { ...targetColumn, isModified: true, _transformationType: transformation, id: uuid, };
            if (transformation === "custom" && expression) {
                updatedMeta = { ...updatedMeta, transformation: expression };
                const meta = { ...targetColumn, ...updatedMeta };
                saveTransformation({
                    id: uuid,
                    field_key: column,
                    transformation_function: {
                        type: "jsonata",
                        expr: expression,
                        condition: null
                    },
                    dataset_id: mainDatasetId,
                }, meta);
            } else {
                const meta = { ...targetColumn, ...updatedMeta };
                saveTransformation({
                    id: uuid,
                    field_key: column,
                    transformation_function: {
                        type: transformation,
                        expr: column,
                        condition: null
                    },
                    dataset_id: mainDatasetId,
                }, meta);
            }


            onClose();
        }
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        if (!transformErrors) updateValues('expression', evaluationData);
        setAnchorEl(null);
    };

    return <>
        <Box sx={{ p: 1, py: 1.5, width: '50vw', height: 'auto', maxWidth: "100%", }}>
            <DialogTitle component={Box} display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h5">
                    Add Field Transformation
                </Typography>
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        data-edataid={interactIds.button.icon.menu.close}
                        data-objectid="closeOutlined:addTransformation"
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
                        customUpdate={setUpdateValues}
                        subscribeErrors={subscribeErrors}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 4 }}>
                {_.get(value, 'transformation') === 'custom' &&
                    <Box mx={2}>
                        <StandardWidthButton data-edataid="jsonata:editor:open"
                            data-objectid="jsonata"
                            data-objecttype="dataset"
                            onClick={handleClick}
                            sx={{ width: 'auto' }}
                        >
                            <Typography variant="h5">
                                Try Out
                            </Typography>
                        </StandardWidthButton>
                    </Box>}
                <StandardWidthButton
                    data-edataid={interactIds.dataset.edit.add.transformation}
                    data-objectid={value}
                    data-objecttype="dataset"
                    variant="contained" autoFocus
                    onClick={_ => updateTransformation()}
                    size="large"
                    sx={{ width: 'auto' }}
                >
                    <Typography variant="h5">
                        Add
                    </Typography>
                </StandardWidthButton>
            </DialogActions>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                PaperProps={{ sx: { height: '100%', width: '100%', overflow: 'hidden' } }}
            >
                <JSONataPlayground
                    handleClose={handleClose}
                    evaluationData={evaluationData}
                    setEvaluationData={setEvaluationData}
                    setTransformErrors={setTransformErrors}
                    transformErrors={transformErrors}
                />
            </Popover>
        </Box>
    </>
}

export default AddTransformationExpression;
