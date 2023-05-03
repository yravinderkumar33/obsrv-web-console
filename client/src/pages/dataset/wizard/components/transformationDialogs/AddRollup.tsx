import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, IconButton } from "@mui/material";
import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import MUIForm from "components/form";
import { useState } from "react";
import * as _ from 'lodash';
import { Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { interactIds } from "data/telemetry/interactIds";

const aggregateFunctions = [
    {
        label: 'COUNT',
        value: 'COUNT',
    },
    {
        label: 'MIN',
        value: 'MIN',
    },
    {
        label: 'MAX',
        value: 'MAX',
    },
    {
        label: 'AVG',
        value: 'AVG',
    },
    {
        label: 'SUM',
        value: 'AVG',
    },
];

const AddRollup = (props: any) => {
    const { data, onClose, setSelection, persistState } = props;
    const [value, subscribe] = useState<any>({});
    const onSubmission = (value: any) => { };
    const wizardState: any = useSelector((state: any) => state?.wizard);
    const jsonSchemaCols: any = _.get(wizardState, ['pages', 'columns', 'state', 'schema']) || [];

    const fields = [
        {
            name: "field",
            label: "Field",
            type: 'autocomplete',
            required: true,
            selectOptions: _.map(jsonSchemaCols, (schema: any) => {
                const name = _.get(schema, 'column');
                return { label: name, value: name };
            }),
        },
        {
            name: "aggregateFunction",
            label: "Aggregate Function",
            type: 'select',
            required: true,
            selectOptions: aggregateFunctions,
        },
        {
            name: "rollupFields",
            label: "Rollup Fields",
            type: 'autocomplete',
            multiple: true,
            selectOptions: _.map(jsonSchemaCols, (schema: any) => {
                const name = _.get(schema, 'column');
                return { label: name, value: name };
            }),
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
            setSelection((preState: any) => {
                const data = [...preState, value];
                persistState(data);
                return data;
            });
            onClose();
        }
    }

    return <>
        <Box sx={{ p: 1, py: 1.5, width: '50vw', height: 'auto', maxWidth: "100%", }}>
            <DialogTitle id="alert-dialog-title">
                Add New Rollup
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        data-edataid={interactIds.button.icon.menu.close}
                        data-objectid="closeCircleOutlined:addNewRollup"
                        data-objecttype="dataset"
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
                <Button 
                data-edataid={interactIds.rollup.add}
                data-objectid={value}
                data-objecttype="dataset"
                variant="contained" autoFocus onClick={_ => addField()}>
                    Add Field
                </Button>
            </DialogActions>
        </Box>
    </>
}

export default AddRollup;
