import { useEffect, useMemo, useState } from 'react';
import { Accordion, AccordionDetails, Box, Button, Grid, IconButton, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import EditConfiguration from './EditConfiguration';
import * as _ from 'lodash';
import { ControlOutlined, DeleteOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import ReactTable from 'components/react-table';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'components/Loader';
import { flattenObject } from 'services/utils';
import { IWizard } from 'types/formWizard';
import { addState } from 'store/reducers/wizard';
import AnimateButton from 'components/@extended/AnimateButton';
import AlertDialog from 'components/AlertDialog';
import { AccordionSummary } from '@mui/material';
import { prepareConfigurationsBySection } from 'services/dataset';

const pageMeta = { pageId: 'configurations', title: "Review" };
const alertDialogContext = { title: 'Delete Configuration', content: 'Are you sure you want to delete this configuration ?' };

const DatasetConfigurations = ({ handleNext, setErrorIndex, handleBack, pick, index }: any) => {

    const theme = useTheme();
    const apiResponse = useSelector((state: any) => state.jsonSchema);
    const ingestionConfigMasterData = useSelector((state: any) => state?.ingestionConfigMasterData);
    const [showEdit, setShowEdit] = useState(false);
    const [selection, setSelection] = useState<Record<string, any>>({});
    const dispatch = useDispatch();
    const wizardState: IWizard = useSelector((state: any) => state?.wizard);
    const pageData = _.get(wizardState, ['pages', pageMeta.pageId]);
    const [flattenedData, setFlattenedData] = useState<Array<Record<string, any>>>([]);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const [expanded, setExpanded] = useState<string | false>('basic');

    const handleExpansionChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

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
                accessor: 'key',
                Cell: ({ value }: any) => {
                    return <Tooltip title={_.get(ingestionConfigMasterData, [value, 'description']) || value}>
                        <div>{_.get(ingestionConfigMasterData, [value, 'label']) || value}</div>
                    </Tooltip>
                }
            },
            {
                Header: 'value',
                accessor: 'value',
                Cell: ({ value }: any) => value.toString()
            },
            {
                Header: 'Actions',
                Cell: ({ value: initialValue, updateMyData, ...rest }: any) => {
                    const { key } = rest?.cell?.row?.values;
                    const metadata = _.get(ingestionConfigMasterData, key);
                    return <Stack direction="row">
                        <IconButton color="primary" size="large" onClick={_ => {
                            setShowEdit(true)
                            setSelection({ value: initialValue, metadata, ...rest })
                        }}>
                            <EditOutlined />
                        </IconButton>
                        <IconButton color="primary" size="large" onClick={e => {
                            setOpenAlertDialog(true);
                            setSelection({ value: initialValue, metadata, ...rest });
                        }}>
                            <DeleteOutlined />
                        </IconButton>
                    </Stack>
                }
            }
        ],
        []
    );

    const [skipPageReset, setSkipPageReset] = useState(false);
    const fetchNonDeletedData = (flattenedData: Array<any>) => _.filter(flattenedData, payload => !_.has(payload, 'isDeleted'));
    const updateMyData = (rowIndex: number, columnId: any, value: any) => setSkipPageReset(true);

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
            {apiResponse?.status !== 'success' && <Grid item xs={12} sm={12}> <Loader /></Grid>}
            {apiResponse?.status === 'error' && <Grid item xs={12} sm={12}> <div>{apiResponse?.error}</div> </Grid>}
            {apiResponse?.status === 'success' &&
                <>
                    <Grid item xs={12} sm={12}>
                        <Box
                            sx={{
                                '& .MuiAccordion-root': {
                                    borderColor: theme.palette.divider,
                                    '& .MuiAccordionSummary-root': {
                                        bgcolor: 'transparent',
                                        flexDirection: 'row'
                                    },
                                    '& .MuiAccordionDetails-root': {
                                        borderColor: theme.palette.divider
                                    },
                                    '& .Mui-expanded': {
                                        color: theme.palette.primary.main
                                    }
                                }
                            }}
                        >
                            {
                                _.toPairs(prepareConfigurationsBySection(fetchNonDeletedData(flattenedData), ingestionConfigMasterData))
                                    .map(([key, value], index) =>
                                        <Accordion key={index} expanded={expanded === key} onChange={handleExpansionChange(key)}>
                                            <AccordionSummary>
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                    <Typography variant="h6"><ControlOutlined /> {_.capitalize(key)} Configurations</Typography>
                                                </Stack>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <ReactTable columns={columns} data={value as any} updateMyData={updateMyData} skipPageReset={skipPageReset} />
                                            </AccordionDetails>
                                        </Accordion>
                                    )
                            }
                            {selection && showEdit && <EditConfiguration open={showEdit} setData={setFlattenedData} onSubmit={() => setShowEdit(false)} selection={selection} ></EditConfiguration>}
                        </Box>
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

export default DatasetConfigurations;
