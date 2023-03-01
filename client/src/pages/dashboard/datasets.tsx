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
import { BugFilled, DeleteOutlined, EditOutlined, PlayCircleOutlined } from '@ant-design/icons';
import CircularWithLabel from 'components/@extended/Progress/CircularWithLabel';
import { useSelector, useDispatch } from 'react-redux';
import FilteringTable from 'components/filtering-table';
import AlertDialog from 'components/AlertDialog';
import AlertMessage from 'components/AlertMessage';

const completionPercentage = 60;
const connectors = ["Kafka", "S3"];

const metrics = [
    {
        key: "Total Events",
        value: "200K"
    },
    {
        key: "Avg Processing Time",
        value: "2 seconds"
    },
    {
        key: "Last Synced",
        value: "2 seconds ago"
    }
];

const alertDialogContext = { title: 'Delete Dataset', content: 'Are you sure you want to delete this dataset ?' };

const DatasetsList = () => {
    const datasets = useSelector((state: any) => state?.dataset?.data);
    const [data, setData] = useState<any>(datasets);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);

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
                                {row.id}
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
                Header: 'Metrics',
                disableFilters: true,
                Cell: ({ value }: any) => {
                    return <Grid container spacing={2} alignItems="center">
                        {
                            Array.isArray(metrics) && metrics.map(metric => {
                                return <Grid item xs={12}>
                                    <Grid container alignItems="center" spacing={1}>
                                        <Grid item sm zeroMinWidth>
                                            <Typography variant="body2">{metric?.key}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="body2" align="right">
                                                {metric?.value}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            })
                        }
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
                Header: 'Created On',
                accessor: 'created_date',
                disableFilters: true,
                Filter: SelectColumnFilter,
                filter: 'includes',
                Cell: ({ value, cell }: any) => {
                    return new Date(value).toLocaleDateString();
                }
            },
            {
                Header: 'Actions',
                accessor: 'color',
                disableFilters: true,
                Cell: () => <Stack direction="row" justifyContent="center" alignItems="center">
                    <Tooltip title="Publish Dataset">
                        <IconButton color="primary" size="large">
                            <PlayCircleOutlined />
                        </IconButton>
                    </Tooltip>
                    {/* <IconButton color="primary" size="large">
                        <EditOutlined />
                    </IconButton>
                    <IconButton color="inherit" size="large" onClick={e => setOpenAlertDialog(true)}>
                        <DeleteOutlined />
                    </IconButton> */}
                </Stack>
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
