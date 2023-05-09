import { BugFilled, DeleteOutlined } from "@ant-design/icons"
import { Box, Grid, Typography } from "@mui/material"
import { Alert, Button } from "@mui/material"
import { Stack } from "@mui/system"
import BasicReactTable from "components/BasicReactTable"
import MainCard from "components/MainCard"
import ScrollX from "components/ScrollX"
import { useEffect, useState } from "react"
import config from 'data/initialConfig';
import { Dialog } from "@mui/material"
import AddDenormField from "./transformationDialogs/AddDenormFields"
import IconButton from "components/@extended/IconButton";
import * as _ from 'lodash';
import { useDispatch, useSelector } from "react-redux"
import { addState } from "store/reducers/wizard"
import { useNavigate } from "react-router"
import { error } from "services/toaster"
import { updateDenormConfig } from "services/dataset"
import interactIds from "data/telemetry/interact.json"

const { spacing } = config;

const getMasterDatasets = (datasets: Array<any>) => {
    return _.filter(datasets, (dataset: Record<string, any>) => _.get(dataset, 'type') === "master-dataset" && ['ACTIVE', 'PUBLISHED'].includes(_.get(dataset, 'status')));
}

const getRedisConfig = (datasets: Array<any>) => {
    const data = _.filter(datasets, dataset => _.get(dataset, 'type') === "master-dataset" && ['ACTIVE', 'PUBLISHED'].includes(_.get(dataset, 'status')));
    if (data.length > 0)
        return {
            redis_db_host: _.get(data, '[0].denorm_config.redis_db_host'),
            redis_db_port: _.get(data, '[0].denorm_config.redis_db_port'),
        }
    else return {
        redis_db_host: '',
        redis_db_port: '',
    };
}

const DataDenorm = (props: any) => {
    const dispatch = useDispatch();
    const { description, id } = props;
    const datasets: any = useSelector((state: any) => _.get(state, 'dataset.data') || []);
    const masterDatasets = getMasterDatasets(datasets);
    const [masterDatasetsExists, setIfMasterDatasetsExists] = useState<boolean>(_.size(masterDatasets) > 0);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const existingState: any = useSelector((state: any) => _.get(state, ['wizard', 'pages', id, 'values']));
    const datasetId: string = useSelector((state: any) => _.get(state, ['wizard', 'pages', 'datasetConfiguration', 'state', 'config', 'dataset_id']));
    const [selection, setSelection] = useState<Array<any>>(existingState || []);
    const navigate = useNavigate();

    const deleteSelection = async (metadata: Record<string, any>) => {
        const data = selection.filter(payload => _.get(payload, 'datasetField') !== _.get(metadata, 'datasetField'));
        await updateDenormFields(data);
    }

    const updateDenormFields = async (payload: any) => {
        const redisConfig = getRedisConfig(datasets);
        const dispatchError = () => dispatch(error({ message: "Error occured saving the config" }));
        try {
            const data = await updateDenormConfig({
                dataset_id: datasetId,
                denorm_config: {
                    redis_db_host: _.get(redisConfig, 'redis_db_host'),
                    redis_db_port: _.get(redisConfig, 'redis_db_port'),
                    denorm_fields: [...payload],
                },
            });
            if (data.data) {
                setSelection(payload);
                pushStateToStore(payload);
            }
            else dispatchError();
        } catch (err) {
            dispatchError();
        }
    }

    const pushStateToStore = (values: Array<any>) => {
        dispatch(addState({ id, values }));
    }

    useEffect(() => {
        existingState && setSelection([...existingState]);
    }, [existingState]);

    const columns = [
        {
            Header: 'Dataset Field',
            accessor: 'denorm_key'
        },
        {
            Header: 'Master Dataset',
            accessor: 'redis_db',
            Cell: ({ value, cell }: any) => {
                const dataset = _.find(masterDatasets, ['dataset_config.redis_db', value]);
                return (
                    <Box>
                        <Typography>{dataset.name}</Typography>
                    </Box>
                );
            },
        },
        {
            Header: 'Input Field (to store the data)',
            accessor: 'denorm_out_field',
        },
        {
            Header: 'Delete',
            Cell: ({ value, cell }: any) => {
                return <IconButton
                        data-edataid={`${interactIds.delete_daatset_denorm}:master`}
                        data-objectid="deleteOutlined:masterDataset"
                        data-objecttype="masterDataset"
                         variant="contained" onClick={(e: any) => deleteSelection(_.get(cell, 'row.original'))}>
                    <DeleteOutlined />
                </IconButton>
            }
        }
    ];

    const masterDatasetNotFound = () => {
        return <>
            <Grid item xs={12}>
                <Stack spacing={spacing} direction="column" justifyContent="center" alignItems="center">
                    <Alert color="error" icon={<BugFilled />} sx={{ alignItems: "center" }}>
                        There are no master datasets configured in the system. Please create one to setup data denormalization for the dataset.
                    </Alert>
                    <Box><Button 
                        data-edataid={`${interactIds.add_dataset_denorm}:master`}
                        data-objectid="createMasterDataset"
                        data-objecttype="masterDataset"
                         onClick={_ => openCreateMasterDataset()}><Typography variant="h5">
                         Create Master Dataset
                     </Typography></Button></Box>
                </Stack>
            </Grid>
        </>
    }

    const renderSelectionTable = () => {
        return <>
            <MainCard content={false}>
                <ScrollX>
                    <BasicReactTable columns={columns} data={selection} striped={true} />
                </ScrollX>
            </MainCard >
        </>
    }

    const openCreateMasterDataset = () => {
        navigate(`/dataset/new/master`, { replace: true });
    }

    const masterDatasetFound = () => {
        return <>
            <Grid item xs={12}>
                {renderSelectionTable()}
            </Grid>
            <Grid item xs={12}>
                <Stack spacing={spacing} direction="row">
                    <Box>
                        <Button
                            data-edataid={`${interactIds.add_dataset_denorm_field}:master`}
                            data-objectid="addDenormField"
                            data-objecttype="masterDataset"
                            variant="contained" onClick={_ => setDialogOpen(true)}
                            >
                                <Typography variant="h5">
                                Add Denorm Field
                            </Typography>
                        </Button>
                         </Box>
                    <Box><Button 
                        data-edataid={`${interactIds.add_dataset_denorm}:master`}
                        data-objectid="createMasterDataset"
                        data-objecttype="masterDataset"
                        variant="contained" onClick={_ => openCreateMasterDataset()}>
                            <Typography variant="h5">
                        Create New Master Dataset
                    </Typography></Button></Box>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Dialog open={dialogOpen} onClose={_ => setDialogOpen(false)}>
                    <AddDenormField
                        selection={selection}
                        setSelection={setSelection}
                        onClose={() => setDialogOpen(false)}
                        persistState={pushStateToStore}
                        masterDatasets={masterDatasets}
                        redisConfig={getRedisConfig(datasets)}
                    />
                </Dialog>
            </Grid >
        </>
    }

    return <>
        <Grid container rowSpacing={spacing}>
            {masterDatasetsExists ? masterDatasetFound() : masterDatasetNotFound()}
        </Grid>
    </>
}

export default DataDenorm
