import Loader from 'components/Loader';
import { fetchDatasetsThunk } from 'store/middlewares';
import { useEffect, useMemo, useState } from 'react';
import { Chip, Divider, Grid, Stack, Tooltip, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { IconButton } from '@mui/material';
import { BugFilled, PlayCircleOutlined, EditOutlined, DatabaseOutlined, DashboardOutlined } from '@ant-design/icons';
import CircularWithLabel from 'components/@extended/Progress/CircularWithLabel';
import { useSelector, useDispatch } from 'react-redux';
import FilteringTable from 'components/filtering-table';
import AlertDialog from 'components/AlertDialog';
import AlertMessage from 'components/AlertMessage';
import { useNavigate } from 'react-router';
import { publishDataset } from 'services/system';
import { error, success } from 'services/toaster';

const completionPercentage = 60;
const connectors = ["Kafka"];

const alertDialogContext = { title: 'Delete Dataset', content: 'Are you sure you want to delete this dataset ?' };

const DatasetsList = () => {
    const datasets = useSelector((state: any) => state?.dataset?.data);
    const [data, setData] = useState<any>(datasets);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const navigateToPath = (path: string) => {
        navigate(path);
    }

    const publish = async (payload: Record<string, any>) => {
        const { id, dataset_name } = payload;
        try {
            await publishDataset({ datasetId: id });
            dispatch(success({ message: "Dataset publishing is under progress." }))
        } catch (err) {
            dispatch(error({ message: "Failed to publish dataset" }));
        }
    }

    const columns = useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'id',
                disableFilters: true,
                Cell: (value: any) => {
                    const row = value?.cell?.row?.original || {};
                    return <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
                        {/* <Grid item>
                            <CircularWithLabel value={completionPercentage} color="success" />
                        </Grid> */}
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
                disableFilters: true,
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
                accessor: 'published_date',
                disableFilters: true,
                Cell: ({ value, cell }: any) => value || "-"
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
                        <Tooltip title="Publish Dataset" onClick={(e: any) => publish(row)}>
                            <IconButton color="primary" size="large">
                                < PlayCircleOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="View Metrics" onClick={(e: any) => navigateToPath(`/datasets/${row?.id}`)}>
                            <IconButton color="primary" size="large">
                                < DashboardOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Create Events" onClick={(e: any) => navigateToPath(`/datasets/addEvents/${row?.id}/${row?.dataset_name}`)}>
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
            {dataset?.status !== 'success' && <Loader />}

            {dataset?.status === 'success' && dataset?.data?.length == 0 &&
                <Grid item xs={12}>
                    {showNoDatasetsError()}
                </Grid>
            }

            {dataset?.status === 'success' && dataset?.data?.length > 0 &&
                <Grid item xs={12}>
                    <DatasetsList />
                </Grid>
            }

        </Grid>
    )
};

export default ClusterHealth;
