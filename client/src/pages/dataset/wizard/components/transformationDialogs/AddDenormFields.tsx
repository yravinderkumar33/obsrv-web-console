import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, IconButton } from "@mui/material";
import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import MUIForm from "components/form";
import { useEffect, useState } from "react";
import * as _ from 'lodash';
import { Stack } from "@mui/material";
import { useSelector } from "react-redux";

const AddDenormField = (props: any) => {
    const { data, onClose, setSelection, persistState, masterDatasets = [] } = props;
    const [value, subscribe] = useState<any>({});
    const onSubmission = (value: any) => { };

    const wizardState: any = useSelector((state: any) => state?.wizard);
    const jsonSchemaCols = _.get(wizardState, 'pages.columns.state.schema') || [];
    const [masterDatasetSchema, setMasterDatasetSchema] = useState<any>([]);

    useEffect(() => {
        const { masterDataset } = value;
        if (masterDataset) {
            const dataset = _.find(masterDatasets, ['name', masterDataset]);
            if (dataset) {
                const schema = _.get(dataset, 'client_state.pages.columns.state.schema') || [];
                setMasterDatasetSchema(schema || []);
            }
        }
    }, [value]);

    const fields = [
        {
            name: "datasetField",
            label: "Dataset Field",
            type: 'select',
            required: true,
            selectOptions: _.map(jsonSchemaCols, (schema: any) => {
                const name = _.get(schema, 'column');
                return { label: name, value: name };
            })
        },
        {
            name: "masterDataset",
            label: "Master Dataset",
            type: 'select',
            required: true,
            selectOptions: _.map(masterDatasets, dataset => {
                const name = _.get(dataset, 'name');
                return {
                    label: name,
                    value: name
                }
            })
        },
        {
            name: "masterDatasetField",
            label: "Master Dataset Field",
            type: 'select',
            required: true,
            selectOptions: _.map(masterDatasetSchema, (schema: any) => {
                const name = _.get(schema, 'column');
                return { label: name, value: name };
            })
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
        <Box sx={{ p: 1, py: 1.5, width: '50vw', height: 'auto' }}>
            <DialogTitle id="alert-dialog-title">
                Add Denorm Field
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

export default AddDenormField;
