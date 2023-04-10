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
import { useDispatch } from "react-redux"
import { updateState } from "store/reducers/wizard"

const { spacing } = config;

const DataDenorm = (props: any) => {
    const dispatch = useDispatch();
    const { description, pageId, index } = props;
    const [masterDatasetsExists, setIfMasterDatasetsExists] = useState<boolean>(true);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [selection, setSelection] = useState<Array<any>>([]);
    const pushStateToStore = (values?: any) => {
        dispatch(updateState({ id: pageId, index: index, state: { denormFields: [...selection] } }));
    }

    const deleteSelection = (metadata: Record<string, any>) => {
        setSelection((preState: Array<any>) => {
            return preState.filter(payload => _.get(payload, 'datasetField') !== _.get(metadata, 'datasetField'));
        })
    }

    useEffect(() => {
        pushStateToStore();
    }, [selection]);

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
                    <Box><Button variant="contained">Create Master Dataset</Button></Box>
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

    const masterDatasetFound = () => {
        return <>
            <Grid item xs={12}>
                {renderSelectionTable()}
            </Grid>
            <Grid item xs={12}>
                <Stack spacing={spacing} direction="row">
                    <Box><Button variant="contained" onClick={_ => setDialogOpen(true)}>Add Denorm Field</Button> </Box>
                    <Box>  <Button variant="contained">Create New Master Dataset</Button></Box>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Dialog open={dialogOpen} onClose={_ => setDialogOpen(false)}>
                    <AddDenormField setSelection={setSelection} onClose={() => setDialogOpen(false)}></AddDenormField>
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
