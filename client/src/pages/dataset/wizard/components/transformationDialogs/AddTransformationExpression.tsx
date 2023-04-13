import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import { Button, IconButton, Paper, Typography } from "@mui/material";
import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import MUIForm from "components/form";
import { useEffect, useMemo, useState } from "react";
import * as _ from 'lodash';
import { useDispatch, useSelector } from "react-redux";
import { addState, updateState } from "store/reducers/wizard";
import { Stack } from "@mui/material";
import { openJsonAtaEditor } from "./AddNewField";
import { saveTransformations } from "services/dataset";
import { error } from "services/toaster";
import { v4 } from "uuid";
import PreviewTransformation from "./PreviewTransform";

const AddTransformationExpression = (props: any) => {
    const { id, data, onClose, selection, setSelection, actions, mainDatasetId } = props;
    const dispatch = useDispatch();
    const [value, subscribe] = useState<any>({});
    const [previewState, setPreviewState] = useState<any>("");
    const filteredData = _.filter(data, payload => {
        if (_.find(selection, ['column', _.get(payload, 'column')])) return false;
        return true
    });
    const wizardState: any = useSelector((state: any) => state?.wizard);
    const jsonData: any = _.get(wizardState, ['pages', 'datasetConfiguration', 'state', 'data']);

    const transformDataPredicate = (payload: Record<string, any>) => ({ label: _.get(payload, 'column'), value: _.get(payload, 'column') });
    const columns = useMemo(() => _.map(filteredData, transformDataPredicate), [data]);

    const pushStateToStore = (values: Record<string, any>) => dispatch(addState({ id, ...values }));
    const onSubmission = (value: any) => { };

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
                        expr: column,
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

    return <>
        <Box sx={{ p: 1, py: 1.5, width: '50vw', height: 'auto' }}>
            <DialogTitle id="alert-dialog-title">
                Add Field Transformation
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseCircleOutlined />
                    </IconButton>
                ) : null}
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} margin={1}>
                    <MUIForm initialValues={{}} subscribe={subscribe} onSubmit={(value: any) => onSubmission(value)} fields={fields} size={{ xs: 12 }} />
                    {
                        value && value.transformation === 'custom' && value.expression &&
                        <PreviewTransformation fieldName={value.column} expression={value.expression} />
                    }
                    {_.get(value, 'transformation') === 'custom' && <Box><Button onClick={_ => openJsonAtaEditor()} variant="contained" size="small" startIcon={<EditOutlined />}>Try it Out</Button></Box>}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" autoFocus onClick={_ => updateTransformation()}>
                    Add
                </Button>
            </DialogActions>
        </Box>
    </>
}

export default AddTransformationExpression;
