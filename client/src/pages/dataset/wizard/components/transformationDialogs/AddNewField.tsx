import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Button, Grid, IconButton, TextField, Tooltip } from "@mui/material";
import { Box, DialogContent, DialogTitle, Popover, Typography } from "@mui/material";
import { useState } from "react";
import * as _ from 'lodash';
import { useDispatch } from "react-redux";
import { addState, updateState } from "store/reducers/wizard";
import { Stack } from "@mui/material";
import { v4 } from "uuid";
import { saveTransformations } from "services/dataset";
import { error } from "services/toaster";
import { interactIds } from "data/telemetry/interactIds";
import JSONataPlayground from "components/JSONataPlayground";
import * as yup from "yup";
import { useFormik } from 'formik';

export const openJsonAtaEditor = () => {
    window.open('https://try.jsonata.org/', '__blank', 'noopener,noreferrer');
}

const AddNewField = (props: any) => {
    const { id, data, onClose, selection, setSelection, mainDatasetId, } = props;
    const [evaluationData, setEvaluationData] = useState<string>('');
    const [transformErrors, setTransformErrors] = useState<boolean>(false);
    const dispatch = useDispatch();
    const pushStateToStore: any = (values: Record<string, any>) => dispatch(addState({ id, ...values }));
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const newFieldForm: any = useFormik({
        initialValues: {
            "column": "",
            "transformation": ""
        },
        onSubmit: (values) => {
            onSubmission(values);
        },
        validationSchema: yup.object().shape({
            column: yup.string().required("This field is required"),
            transformation: yup.string().required("This field is required"),
        }),
        enableReinitialize: true,
    });

    const saveTransformation = async (payload: any, updateStateData: any) => {
        const dispatchError = () => dispatch(error({ message: "Error occured saving the transformation config" }));
        try {
            const data = await saveTransformations(payload);
            if (data.data)
                setSelection((preState: any) => {
                    const updatedState = [...preState, updateStateData];
                    pushStateToStore({ selection: updatedState });
                    return updateState;
                });
            else dispatchError();
        } catch (err) {
            dispatchError();
        }
    }

    const updateAdditionalField = () => {
        const { column, transformation } = newFieldForm.values;
        if (column && transformation) {
            const uuid = v4();
            const updatedColumnMetadata = { column, transformation, isModified: true, _transformationType: "custom", id: uuid, }
            saveTransformation({
                id: uuid,
                field_key: column,
                transformation_function: {
                    type: "jsonata",
                    expr: transformation,
                    condition: null
                },
                dataset_id: mainDatasetId,
            }, updatedColumnMetadata);
            onClose();
        }
    }

    const fields: any = [
        {
            name: "column",
            label: "Field Name",
            type: 'text',
            required: true
        },
        {
            name: "transformation",
            label: "Transformation Expression",
            type: 'text',
            required: true,
            helperText: <>
                Ex: $sum(Product.(Price * Quantity)) <br /> FirstName & " " & Surname
            </>,
        }
    ];

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        if (!transformErrors) newFieldForm.setFieldValue("transformation", evaluationData);
        setAnchorEl(null);
    };

    const onSubmission = (values: any) => { updateAdditionalField() };

    return <>
        <Box sx={{ p: 1, py: 1.5, width: '50vw', maxWidth: "100%", }}>
            <DialogTitle component={Box} display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h5">
                    Add New Field
                </Typography>
                {onClose ? (
                    <IconButton
                        id="iconButton"
                        data-edataid={interactIds.button.icon.menu.close}
                        data-objectid="closeOutlined:addNewField"
                        data-objecttype="dataset"
                        aria-label="close"
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
                    <form onSubmit={newFieldForm.handleSubmit}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                {fields.map((item: any) => (
                                    <Tooltip title={item.label} key={item.name}>
                                        <TextField
                                            value={newFieldForm.values[item.name]}
                                            onChange={newFieldForm.handleChange}
                                            name={item.name}
                                            label={item.label}
                                            sx={{ m: 1 }}
                                            variant="outlined"
                                            fullWidth
                                            autoComplete="off"
                                            onBlur={newFieldForm.handleBlur}
                                            error={Boolean(newFieldForm.errors[item.name])}
                                            helperText={newFieldForm.touched[item.name] && newFieldForm.errors[item.name] && String(newFieldForm.errors[item.name]) || item.helperText}
                                        />
                                    </Tooltip>
                                ))}
                            </Grid>
                            <Grid item xs={12} display="flex" alignItems="center" justifyContent="flex-end">
                                <Box mx={2}>
                                    <Button
                                        data-edataid="jsonata:editor:open"
                                        data-objectid="jsonata"
                                        data-objecttype="dataset"
                                        onClick={handleClick}
                                    >
                                        <Typography variant="h5">
                                            Try Out
                                        </Typography>
                                    </Button>
                                </Box>
                                <Button
                                    data-edataid={interactIds.dataset.edit.add.transformation}
                                    data-objectid={newFieldForm.values}
                                    data-objecttype="dataset"
                                    variant="contained"
                                    type="submit"
                                    size="large"
                                >
                                    <Typography variant="h5">
                                        Add
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </ Stack>
            </DialogContent>
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

export default AddNewField;
