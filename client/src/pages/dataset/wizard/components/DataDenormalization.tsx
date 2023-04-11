import { BugFilled, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons"
import { Box, Grid } from "@mui/material"
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
import { updateState } from "store/reducers/wizard"
import { useNavigate } from "react-router"

const { spacing } = config;

const getMasterDatasets = (datasets: Array<any>) => {
    return _.filter(datasets, dataset => _.get(dataset, 'type') === "master");
}

const DataDenorm = (props: any) => {
    const dispatch = useDispatch();
    const { description, id } = props;
    const datasets: any = useSelector((state: any) => _.get(state, 'dataset.data') || []);
    const masterDatasets = getMasterDatasets(datasets);
    const [masterDatasetsExists, setIfMasterDatasetsExists] = useState<boolean>(_.size(masterDatasets) > 0);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const existingState: any = useSelector((state: any) => _.get(state, ['wizard', 'pages', id, 'values']));
    const [selection, setSelection] = useState<Array<any>>(existingState || []);
    const navigate = useNavigate();

    const deleteSelection = (metadata: Record<string, any>) => {
        setSelection((preState: Array<any>) => {
            const data = preState.filter(payload => _.get(payload, 'datasetField') !== _.get(metadata, 'datasetField'));
            pushStateToStore(data);
            return data;
        })
    }

    const pushStateToStore = (values: Array<any>) => {
        dispatch(updateState({ id, values }));
    }

    useEffect(() => {
        existingState && setSelection(existingState);
    }, [existingState]);

    const columns = [
        {
            Header: 'Dataset Field',
            accessor: 'datasetField'
        },
        {
            Header: 'Master Dataset',
            accessor: 'masterDataset'
        },
        {
            Header: 'Master Datset Field',
            accessor: 'masterDatasetField'
        },
        {
            Header: 'Delete',
            Cell: ({ value, cell }: any) => {
                return <IconButton variant="contained" onClick={(e: any) => deleteSelection(_.get(cell, 'row.original'))}>
                    <DeleteOutlined />
                </IconButton>
            }
        }
    ];

    const masterDatasetNotFound = () => {
        return <>
            <Grid item xs={12}>
                <Stack spacing={spacing} direction="column" justifyContent="center" alignItems="center">
                    <Alert color="error" icon={<BugFilled />}>
                        There are no master datasets configured in the system. Please create one to setup data denormalization for the dataset.
                    </Alert>
                    <Box><Button variant="contained" onClick={_ => openCreateMasterDataset()}>Create Master Dataset</Button></Box>
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
                    <Box><Button variant="contained" onClick={_ => setDialogOpen(true)}>Add Denorm Field</Button> </Box>
                    <Box><Button variant="contained" onClick={_ => openCreateMasterDataset()}>Create New Master Dataset</Button></Box>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Dialog open={dialogOpen} onClose={_ => setDialogOpen(false)}>
                    <AddDenormField
                        setSelection={setSelection}
                        onClose={() => setDialogOpen(false)}
                        persistState={pushStateToStore}
                        masterDatasets={masterDatasets}
                    />
                </Dialog>
            </Grid >
        </>
    }

    return <>
        <Grid container rowSpacing={spacing}>
            {description && <Grid item xs={12}> <Alert color="info" icon={<InfoCircleOutlined />}> {description}</Alert></Grid>}
            {masterDatasetsExists ? masterDatasetFound() : masterDatasetNotFound()}
        </Grid>
    </>
}

export default DataDenorm
