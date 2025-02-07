import { useMemo, useState } from 'react';
import { Chip, Divider, Grid, Stack, Tooltip, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { IconButton } from '@mui/material';
import { PlayCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import FilteringTable from 'components/filtering-table';
import AlertDialog from 'components/AlertDialog';
import { useNavigate } from 'react-router';
import { publishDataset } from 'services/system';
import { error, success } from 'services/toaster';
import dayjs from 'dayjs';
import * as _ from 'lodash';

const connectors = ["Kafka"];
const alertDialogContext = { title: 'Delete Dataset', content: 'Are you sure you want to delete this dataset ?' };

const DraftDatasetsList = ({ datasets }: any) => {
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
            await publishDataset({ data: { datasetId: id } });
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
                            <Chip color={'warning' || row?.color} label={typeof value == 'string' && value.toUpperCase()} size="small" variant="light" />          </Grid>
                    </Grid>
                }
            },
            {
                Header: 'Created On',
                accessor: 'created_date',
                disableFilters: true,
                Cell: ({ value, cell }: any) => dayjs(value).format('YYYY-MM-DD HH:mm:ss') || "-"
            },
            {
                Header: 'Total Events (Today)',
                disableFilters: true,
                Cell: ({ value, cell }: any) => '-'
            },
            {
                Header: 'Total Events (Yesterday)',
                disableFilters: true,
                Cell: ({ value, cell }: any) => '-'
            },
            {
                Header: 'Avg Processing Time (Today)',
                disableFilters: true,
                Cell: ({ value, cell }: any) => '-'
            },
            {
                Header: 'Last Synced Time',
                disableFilters: true,
                Cell: ({ value, cell }: any) => '-'
            },
            {
                Header: 'Event Failed (Today)',
                disableFilters: true,
                Cell: ({ value, cell }: any) => '-'
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
                        <Tooltip title="Edit Dataset">
                            <IconButton color="primary" size="large" disabled>
                                <EditOutlined />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                }
            }
        ],
        []
    );

    const handleClose = (status: boolean) => {
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

export default DraftDatasetsList;
