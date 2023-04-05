import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, IconButton } from "@mui/material";
import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import MUIForm from "components/form";
import { useMemo, useState } from "react";
import * as _ from 'lodash';
import { useDispatch } from "react-redux";
import { updateState } from "store/reducers/wizard";

const AddPIIDialog = (props: any) => {
    const { data, onClose, setSelection, actions } = props;
    const [value, subscribe] = useState<any>({});
    const dispatch = useDispatch();
    const columns = useMemo(() => _.map(data, payload => ({ label: _.get(payload, 'column'), value: _.get(payload, 'column') })), [data]);
    const onSubmission = (value: any) => { console.log({ value }) }
    const pushStateToStore = (values: Record<string, any>) => dispatch(updateState({ id: 'columns', state: { ...values } }));

    const updateColumns = (updatedCol: Record<string, any>) => {
        const updatedColumnData = _.map(data, payload => {
            if (_.get(payload, 'column') === _.get(updatedCol, 'column')) {
                return updatedCol
            }
            return payload;
        })
        pushStateToStore({ schema: updatedColumnData });
    }

    const updatePIIMeta = () => {
        const { column, transformation } = value;
        const targetColumn = _.find(data, ['column', column]);
        if (targetColumn) {
            const updatedColumnMetadata = { ...targetColumn, isModified: true, pii: { "value": true, "op": transformation }, _transformationType: transformation }
            updateColumns(updatedColumnMetadata)
            setSelection((preState: Array<any>) => ([...preState, updatedColumnMetadata]));
            onClose();
        }
    }

    const fields = [
        {
            name: "column",
            label: "Select Field",
            type: 'select',
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
    ]

    return <>
        <Box sx={{ p: 1, py: 1.5, width: '50vw' }}>
            <DialogTitle id="alert-dialog-title">
                Add PII Field
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
                <MUIForm initialValues={{}} subscribe={subscribe} onSubmit={(value: any) => onSubmission(value)} fields={fields} size={{ xs: 12 }} />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={_ => updatePIIMeta()}>
                    Add
                </Button>
            </DialogActions>
        </Box></>
}

export default AddPIIDialog;