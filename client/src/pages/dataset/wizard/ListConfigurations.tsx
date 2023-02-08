import { useEffect, useMemo, useState } from 'react';
import { Button, Grid, IconButton, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import EditConfiguration from './EditConfiguration';
import * as _ from 'lodash';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ReactTable from 'components/react-table';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'components/Loader';
import { flattenObject } from 'services/utils';
import { IWizard } from 'types/formWizard';
import { addState } from 'store/reducers/wizard';
import AnimateButton from 'components/@extended/AnimateButton';
import AlertDialog from 'components/AlertDialog';

const pageMeta = { pageId: 'configurations', title: "Review" };
const alertDialogContext = { title: 'Delete Configuration', content: 'Are you sure you want to delete this configuration ?' };

const ListConfigurations = ({ handleNext, setErrorIndex, handleBack, pick, index }: any) => {
    const apiResponse = useSelector((state: any) => state.jsonSchema);
    const [showEdit, setShowEdit] = useState(false);
    const [selection, setSelection] = useState<Record<string, any>>({});
    const dispatch = useDispatch()
    const wizardState: IWizard = useSelector((state: any) => state?.wizard);
    const pageData = _.get(wizardState, ['pages', pageMeta.pageId]);
    const [flattenedData, setFlattenedData] = useState<Array<Record<string, any>>>([]);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);

    const markRowAsDeleted = (cellValue: Record<string, any>) => {
        const key = cellValue?.key
        if (key) {
            setFlattenedData((preState: Array<Record<string, any>>) => {
                return _.map(preState, payload => {
                    return {
                        ...payload,
                        ...(_.get(payload, 'key') === key && {
                            isModified: true,
                            isDeleted: true
                        })
                    }
                })
            })
        }
    }

    const persistState = () => {
        dispatch(
            addState({
                id: pageMeta.pageId,
                index,
                state: { configurations: flattenedData }
            }));
    }

    const gotoNextSection = () => {
        persistState();
        handleNext();
    }

    const gotoPreviousSection = () => {
        persistState();
        handleBack();
    }

    const columns = useMemo(
        () => [
            {
                Header: 'Configuration',
                accessor: 'key'
            },
            {
                Header: 'value',
                accessor: 'value',
                Cell: ({ value }: any) => value.toString()
            },
            {
                Header: 'Actions',
                Cell: ({ value: initialValue, updateMyData, ...rest }: any) =>
                    <Stack direction="row">
                        <IconButton color="primary" size="large" onClick={_ => {
                            setShowEdit(true)
                            setSelection({ value: initialValue, ...rest })
                        }}>
                            <EditOutlined />
                        </IconButton>
                        <IconButton color="primary" size="large" onClick={e => {
                            setOpenAlertDialog(true);
                            setSelection({ value: initialValue, ...rest });
                        }}>
                            <DeleteOutlined />
                        </IconButton>
                    </Stack>
            }
        ],
        []
    );

    const [skipPageReset, setSkipPageReset] = useState(false);
    const fetchNonDeletedData = (flattenedData: Array<any>) => _.filter(flattenedData, payload => !_.has(payload, 'isDeleted'));

    const updateMyData = (rowIndex: number, columnId: any, value: any) => {
        setSkipPageReset(true);
    };

    const handleAlertDialogClose = (status: boolean) => {
        if (selection && status) {
            markRowAsDeleted(selection?.cell?.row?.values);
        }
        setOpenAlertDialog(false);
    }

    useEffect(() => {
        if (apiResponse?.status === 'success' && apiResponse?.data?.configurations) {
            const flattenedSchema = flattenObject(apiResponse.data.configurations) as any;
            const existingState = pageData?.state?.configurations;
            setFlattenedData(existingState || flattenedSchema);
            setSkipPageReset(false);
        }
    }, [apiResponse?.status]);

    return <>
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            {pageMeta.title} {pick || 'Configurations'}
        </Typography>

        <Grid container spacing={2}>

            {apiResponse?.status !== 'success' &&
                <Grid item xs={12} sm={12}>
                    <Loader />
                </Grid>
            }

            {apiResponse?.status === 'error' &&
                <Grid item xs={12} sm={12}>
                    <div>Error</div>
                </Grid>
            }

            {apiResponse?.status === 'success' &&
                <>
                    <Grid item xs={12} sm={12}>
                        <Stack spacing={2}>
                            {
                                _.toPairs(_.reduce(fetchNonDeletedData(flattenedData) as [], (acc: Record<string, any>, value: { key: string }) => {
                                    const key = value.key;
                                    const [parent] = key.split('.')
                                    if (parent && parent === pick) {
                                        const values = acc[parent];
                                        if (!values) acc[parent] = []
                                        acc[parent].push(value)
                                    }
                                    return acc
                                }, {})).map(([key, value], index) =>
                                    <MainCard content={false} key={index}>
                                        <ScrollX>
                                            <ReactTable columns={columns} data={value} updateMyData={updateMyData} skipPageReset={skipPageReset} />
                                        </ScrollX>
                                    </MainCard >
                                )
                            }
                        </Stack>
                        {selection && showEdit && <EditConfiguration open={showEdit} setData={setFlattenedData} onSubmit={() => setShowEdit(false)} selection={selection} ></EditConfiguration>}
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row" justifyContent="space-between">
                            <AnimateButton>
                                <Button variant="contained" sx={{ my: 3, ml: 1 }} type="button" onClick={gotoPreviousSection}>
                                    Previous
                                </Button>
                            </AnimateButton>
                            <AnimateButton>
                                <Button variant="contained" sx={{ my: 3, ml: 1 }} type="button" onClick={gotoNextSection}>
                                    Next
                                </Button>
                            </AnimateButton>
                        </Stack>
                    </Grid>
                </>
            }
        </Grid>
        <AlertDialog open={openAlertDialog} handleClose={handleAlertDialogClose} context={alertDialogContext}></AlertDialog>
    </>;
};

export default ListConfigurations;
