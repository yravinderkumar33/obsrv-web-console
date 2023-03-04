import Loader from 'components/Loader';
import { fetchDatasetsThunk } from 'store/middlewares';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Chip, Divider, Grid, Stack, Tooltip, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import {
    SelectColumnFilter,
} from 'utils/react-table';
import { IconButton } from '@mui/material';
import { BugFilled, PlayCircleOutlined, EditOutlined, DatabaseOutlined, DashboardOutlined } from '@ant-design/icons';
import CircularWithLabel from 'components/@extended/Progress/CircularWithLabel';
import { useSelector, useDispatch } from 'react-redux';
import FilteringTable from 'components/filtering-table';
import AlertDialog from 'components/AlertDialog';
import AlertMessage from 'components/AlertMessage';
import { useNavigate } from 'react-router';

const completionPercentage = 60;
const connectors = ["Kafka"];

const alertDialogContext = { title: 'Delete Dataset', content: 'Are you sure you want to delete this dataset ?' };

const DatasetsList = () => {
    const datasets = useSelector((state: any) => state?.dataset?.data);
    const [data, setData] = useState<any>(datasets);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const navigate = useNavigate()

    const navigateToPath = (path: string) => {
        navigate(path);
    }

    const columns = useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'id',
                Cell: (value: any) => {
                    const row = value?.cell?.row?.original || {};
                    return <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
                        <Grid item>
                            <CircularWithLabel value={completionPercentage} color="success" />
                        </Grid>
                        <Grid item xs zeroMinWidth>
                            <Typography align="left" variant="subtitle1">
                                {row?.dataset_name}
                            </Typography>
                            <Stack
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                spacing={1}
                                divider={<Divider orientation="vertical" flexItem />}
                            >
                                {
                                    connectors?.map((connector: string) => {
                                        return <Typography align="left" variant="caption" color="secondary">
                                            {connector}
                                        </Typography>
                                    })
                                }
                            </Stack>
                        </Grid>
                    </Grid>
                }
            },
            {
                Header: 'Status',
                accessor: 'status',
                Filter: SelectColumnFilter,
                filter: 'includes',
                Cell: ({ value, cell }: any) => {
                    const row = cell?.row?.original || {};
                    return <Grid container spacing={1} justifyContent="center">
                        <Grid item>
                            <Chip color={'success' || row?.color} label={typeof value == 'string' && value.toUpperCase()} size="small" variant="light" />          </Grid>
                    </Grid>
                }
            },
            {
                Header: 'Published On',
                disableFilters: true,
                Cell: ({ value, cell }: any) => new Date().toLocaleDateString()
            },
            {
                Header: 'Total Events (Prev Day)',
                disableFilters: true,
                Cell: ({ value, cell }: any) => 0
            },
            {
                Header: 'Total Events (Today)',
                disableFilters: true,
                Cell: ({ value, cell }: any) => 0
            },
            {
                Header: 'Avg Processing Time (Today)',
                disableFilters: true,
                Cell: ({ value, cell }: any) => 0
            },
            {
                Header: 'Last Synced Time',
                disableFilters: true,
                Cell: ({ value, cell }: any) => 0
            },
            {
                Header: 'Event Failure Percentage',
                disableFilters: true,
                Cell: ({ value, cell }: any) => 0
            },
            {
                Header: 'Actions',
                accessor: 'color',
                disableFilters: true,
                Cell: ({ value, cell }: any) => {
                    const row = cell?.row?.original || {};
                    return <Stack direction="row" justifyContent="center" alignItems="center">
                        <Tooltip title="View Metrics" onClick={(e: any) => navigateToPath(`/datasets/${row?.id}`)}>
                            <IconButton color="primary" size="large">
                                <PlayCircleOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Publish Dataset">
                            <IconButton color="primary" size="large">
                                <DashboardOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Dataset">
                            <IconButton color="primary" size="large">
                                <EditOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Create Events" onClick={(e: any) => navigateToPath(`/datasets/addEvents/${row?.id}`)}>
                            <IconButton color="primary" size="large">
                                <DatabaseOutlined />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                }
            }
        ],
        []
    );

    const handleClose = (status: boolean) => {
        if (status) {
            // delete dataset
        }
        setOpenAlertDialog(false)
    }

    return (
        <MainCard content={false}>
            <ScrollX>
                <FilteringTable columns={columns} data={data} />
            </ScrollX>
            <AlertDialog open={openAlertDialog} handleClose={handleClose} context={alertDialogContext}></AlertDialog>
        </MainCard>
    );
};

const ClusterHealth = () => {
    const dataset = useSelector((state: any) => state.dataset)
    const dispatch = useDispatch();
    const showNoDatasetsError = () => <AlertMessage color='error' messsage={' No Datasets Found'} icon={BugFilled} />

    useEffect(() => {
        if (dataset?.status !== 'success') dispatch(fetchDatasetsThunk({}));
    }, [])

    return (
        <Grid container rowSpacing={4.5} columnSpacing={3}>
            <Grid item xs={12}>
                {dataset?.status !== 'success' && <Loader />}
                {dataset?.status === 'success' && dataset?.data?.length == 0 && showNoDatasetsError()}
                {dataset?.status === 'success' && dataset?.data?.length > 0 && <DatasetsList />}
            </Grid>
        </Grid>
    )
};

export default ClusterHealth;
