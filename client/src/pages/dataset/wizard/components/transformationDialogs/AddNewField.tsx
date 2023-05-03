import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import { Button, IconButton } from "@mui/material";
import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import MUIForm from "components/form";
import { useState } from "react";
import * as _ from 'lodash';
import { useDispatch } from "react-redux";
import { addState, updateState } from "store/reducers/wizard";
import { Stack } from "@mui/material";
import { v4 } from "uuid";
import { saveTransformations } from "services/dataset";
import { error } from "services/toaster";
import PreviewTransformation from "./PreviewTransform";

export const openJsonAtaEditor = () => {
    window.open('https://try.jsonata.org/', '__blank', 'noopener,noreferrer');
}

const AddNewField = (props: any) => {
    const { id, data, onClose, selection, setSelection, mainDatasetId, } = props;
    const [value, subscribe] = useState<any>({});
    const dispatch = useDispatch();
    const onSubmission = (value: any) => { };
    const pushStateToStore = (values: Record<string, any>) => dispatch(addState({ id, ...values }));

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
        const { column, transformation } = value;
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

    const fields = [
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
    ]

    return <>
        <Box sx={{ p: 1, py: 1.5, width: '50vw', maxWidth: "100%", }}>
            <DialogTitle id="alert-dialog-title">
                Add New Field
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
                        value.column && value.transformation &&
                        <PreviewTransformation fieldName={value.column} expression={value.transformation} />
                    }
                    <Box>
                        <Button onClick={_ => openJsonAtaEditor()} variant="contained" size="small" startIcon={<EditOutlined />}>Try it Out</Button>
                    </ Box>
                </ Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={_ => updateAdditionalField()}>
                    Add
                </Button>
            </DialogActions>
        </Box>
    </>
}

export default AddNewField;
