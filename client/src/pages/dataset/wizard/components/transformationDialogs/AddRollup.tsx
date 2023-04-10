import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, IconButton } from "@mui/material";
import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import MUIForm from "components/form";
import { useState } from "react";
import * as _ from 'lodash';
import { Stack } from "@mui/material";

const AddRollup = (props: any) => {
    const { data, onClose, setSelection } = props;
    const [value, subscribe] = useState<any>({});
    const onSubmission = (value: any) => { console.log({ value }) }

    const fields = [
        {
            name: "field",
            label: "Field",
            type: 'text',
            required: true,
        },
        {
            name: "aggregateFunction",
            label: "Aggregate Function",
            type: 'text',
            required: true,
        },
        {
            name: "rollupFieldName",
            label: "Rollup Field Name",
            type: 'text',
            required: true
        }
    ];

    const addField = () => {
        if (_.size(value) === fields.length) {
            setSelection((preState: any) => ([...preState, value]))
            onClose();
        }
    }

    return <>
        <Box sx={{ p: 1, py: 1.5, width: '50vw', height: 'auto' }}>
            <DialogTitle id="alert-dialog-title">
                Add New Rollup
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
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" autoFocus onClick={_ => addField()}>
                    Add Field
                </Button>
            </DialogActions>
        </Box>
    </>
}

export default AddRollup;