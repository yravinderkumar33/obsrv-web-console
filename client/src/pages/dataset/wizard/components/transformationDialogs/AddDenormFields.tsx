import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, IconButton } from "@mui/material";
import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import MUIForm from "components/form";
import { useEffect, useState } from "react";
import * as _ from 'lodash';
import { Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { error } from "services/toaster";
import { updateDenormConfig } from "services/dataset";

const AddDenormField = (props: any) => {
    const { selection, redisConfig, onClose, setSelection, persistState, masterDatasets = [] } = props;
    const [value, subscribe] = useState<any>({});
    const onSubmission = (value: any) => { };
    const dispatch = useDispatch();
    const wizardState: any = useSelector((state: any) => state?.wizard);
    const jsonSchemaCols = _.get(wizardState, 'pages.columns.state.schema') || [];
    const [masterDatasetSchema, setMasterDatasetSchema] = useState<any>([]);
    const datasetId: string = useSelector((state: any) => _.get(state, ['wizard', 'pages', 'datasetConfiguration', 'state', 'config', 'dataset_id']));

    useEffect(() => {
        const { redis_db } = value;
        if (redis_db) {
            const dataset = _.find(masterDatasets, ['dataset_config.redis_db', redis_db]);
            if (dataset) {
                const schema = _.get(dataset, 'client_state.pages.columns.state.schema') || [];
                setMasterDatasetSchema(schema || []);
            }
        }
    }, [value]);

    const fields = [
        {
            name: "denorm_key",
            label: "Dataset Field",
            type: 'autocomplete',
            required: true,
            selectOptions: _.map(jsonSchemaCols, (schema: any) => {
                const name = _.get(schema, 'column');
                return { label: name, value: name };
            }),
        },
        {
            name: "redis_db",
            label: "Master Dataset",
            type: 'select',
            required: true,
            selectOptions: _.map(masterDatasets, dataset => {
                const name = _.get(dataset, 'name');
                const value = _.get(dataset, ['dataset_config', 'redis_db'])
                return {
                    label: name,
                    value: value,
                }
            })
        },
        {
            name: "denorm_out_field",
            label: "Input Field (to store the data)",
            type: 'text',
            required: true,
        },
    ];

    const updateDenormFields = async (payload: any) => {
        const dispatchError = () => dispatch(error({ message: "Error occured saving the config" }));
        try {
            const data = await updateDenormConfig({
                dataset_id: datasetId,
                denorm_config: {
                    redis_db_host: redisConfig.redis_db_host,
                    redis_db_port: redisConfig.redis_db_port,
                    denormFields: [...selection, payload],
                },
            });

            if (data.data)
                setSelection((preState: any) => {
                    const data = [...preState, payload];
                    persistState(data);
                    return data;
                });
            else dispatchError();
        } catch (err) {
            dispatchError();
        }
    }

    const addField = () => {
        if (_.size(value) === fields.length) {
            updateDenormFields(value);
            onClose();
        }
    }

    return <>
        <Box sx={{ p: 1, py: 1.5, width: '50vw', maxWidth: "100%", height: 'auto' }}>
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
