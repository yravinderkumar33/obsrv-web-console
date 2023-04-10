import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import { Button, IconButton } from "@mui/material";
import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import MUIForm from "components/form";
import { useMemo, useState } from "react";
import * as _ from 'lodash';
import { useDispatch } from "react-redux";
import { updateState } from "store/reducers/wizard";
import { Stack } from "@mui/material";

export const openJsonAtaEditor = () => {
    window.open('https://try.jsonata.org/', '__blank');
}

const AddNewField = (props: any) => {
    const { id, data, onClose, selection, setSelection } = props;
    const [value, subscribe] = useState<any>({});
    const dispatch = useDispatch();
    const onSubmission = (value: any) => { console.log({ value }) }
    const pushStateToStore = (values: Record<string, any>) => dispatch(updateState({ id, ...values }));

    
    const updatePIIMeta = () => {
        const { column, transformation } = value;
        if (column && transformation) {
            const updatedColumnMetadata = { column, transformation, isModified: true, _transformationType: "custom" }
            setSelection((preState: Array<any>) => {
                const updatedState = [...preState, updatedColumnMetadata];
                pushStateToStore({ selection: updatedState });
                return updateState;
            });
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
            required: true
        }
    ]

    return <>
        <Box sx={{ p: 1, py: 1.5, width: '50vw' }}>
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
                    <Box>
                        <Button onClick={_ => openJsonAtaEditor()} variant="contained" size="small" startIcon={<EditOutlined />}>Try it Out</Button>
                    </ Box>
                </ Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={_ => updatePIIMeta()}>
                    Add
                </Button>
            </DialogActions>
        </Box></>
}

export default AddNewField;