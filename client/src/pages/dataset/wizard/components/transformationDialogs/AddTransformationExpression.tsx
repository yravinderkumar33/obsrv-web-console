import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import { Button, IconButton } from "@mui/material";
import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import MUIForm from "components/form";
import { useMemo, useState } from "react";
import * as _ from 'lodash';
import { useDispatch } from "react-redux";
import { updateState } from "store/reducers/wizard";
import { Stack } from "@mui/material";
import { openJsonAtaEditor } from "./AddNewField";

const AddTransformationExpression = (props: any) => {
    const { data, onClose, selection, setSelection, actions } = props;
    const dispatch = useDispatch();
    const [value, subscribe] = useState<any>({});
    const filteredData = _.filter(data, payload => {
        if (_.find(selection, ['column', _.get(payload, 'column')])) return false;
        return true
    });

    const transformDataPredicate = (payload: Record<string, any>) => ({ label: _.get(payload, 'column'), value: _.get(payload, 'column') });
    const columns = useMemo(() => _.map(filteredData, transformDataPredicate), [data]);

    const pushStateToStore = (values: Record<string, any>) => dispatch(updateState({ id: 'columns', state: { ...values } }));
    const onSubmission = (value: any) => { console.log({ value }) }

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
        },
        {
            name: "expression",
            label: "Add Custom Expression",
            type: 'text',
            dependsOn: {
                key: "transformation",
                value: "custom"
            },
            required: true
        }
    ];

    const updateColumns = (updatedCol: Record<string, any>) => {
        const updatedColumnData = _.map(data, payload => {
            if (_.get(payload, 'column') === _.get(updatedCol, 'column')) {
                return updatedCol
            }
            return payload;
        });
        pushStateToStore({ schema: updatedColumnData });
    }

    const updateTransformation = () => {
        const { column, transformation, expression } = value;
        const targetColumn = _.find(data, ['column', column]);
        if (targetColumn) {
            let updatedMeta: Record<string, any> = { ...targetColumn, isModified: true, _transformationType: transformation };
            if (transformation === "custom" && expression) {
                updatedMeta = { ...updatedMeta, transformation: expression };
            } else {
                updatedMeta = { ...updatedMeta, pii: { "value": true, "op": transformation } };
            }
            updateColumns(updatedMeta);
            const meta = { ...targetColumn, ...updatedMeta };
            setSelection((preState: Array<any>) => ([...preState, meta]));
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