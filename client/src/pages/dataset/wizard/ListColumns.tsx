import React, { useEffect, useMemo, useState } from 'react';
import {
    Button, Grid, IconButton,
    Stack, TextField, Tooltip, Typography,
    FormControl, Select, MenuItem, Dialog,
    FormControlLabel, Chip, Alert, DialogTitle, Box, Popover
} from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import * as _ from 'lodash';
import { CheckOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, ExclamationCircleOutlined, FolderViewOutlined, UploadOutlined } from '@ant-design/icons';
import ReactTable from 'components/react-table';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'components/Loader';
import AnimateButton from 'components/@extended/AnimateButton';
import { IWizard } from 'types/formWizard';
import { addState } from 'store/reducers/wizard';
import AlertDialog from 'components/AlertDialog';
import { error } from 'services/toaster';
import { areConflictsResolved, checkForCriticalSuggestion, flattenSchema } from 'services/json-schema';
import RequiredSwitch from 'components/RequiredSwitch';
import { connect } from 'react-redux';
import IconButtonWithTips from 'components/IconButtonWithTips';

const validDatatypes = ['string', 'number', 'integer', 'object', 'array', 'boolean', 'null'];
const pageMeta = { pageId: 'columns', title: "Derive Schema" };
const alertDialogContext = { title: 'Delete Column', content: 'Are you sure you want to delete this column ?' };

interface columnFilter {
    label: string,
    id: string | boolean,
    lookup: string,
    color: "default" | "error" | "warning" | "success" | "primary" | "secondary" | "info"
}

const columnFilters: columnFilter[] = [
    {
        'label': 'Critical',
        'id': 'CRITICAL',
        'lookup': 'severity',
        'color': "warning"
    },
    {
        'label': 'High',
        'id': 'HIGH',
        'lookup': 'severity',
        'color': "error"
    },
    {
        'label': 'Resolved',
        'id': true,
        'lookup': 'resolved',
        'color': "success"
    }
];

const ListColumns = ({ handleNext, setErrorIndex, handleBack, index, wizardStoreState }: any) => {
    const apiResponse = useSelector((state: any) => state.jsonSchema);
    const [selection, setSelection] = useState<Record<string, any>>({});
    const dispatch = useDispatch()
    const wizardState: IWizard = useSelector((state: any) => state?.wizard);
    const pageData = _.get(wizardState, ['pages', pageMeta.pageId]);
    const [flattenedData, setFlattenedData] = useState<Array<Record<string, any>>>([]);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const globalConfig = useSelector((state: any) => state?.config);
    const [filterByChip, setFilterByChip] = useState<columnFilter | null>(null);

    const markRowAsDeleted = (cellValue: Record<string, any>) => {
        const column = cellValue?.column
        if (column) {
            setFlattenedData((preState: Array<Record<string, any>>) => {
                return _.map(preState, payload => {
                    return {
                        ...payload,
                        ...(_.get(payload, 'column') === column && {
                            isModified: true,
                            isDeleted: true
                        })
                    }
                })
            });
            persistState();
        }
    }

    const persistState = () => dispatch(addState({ id: pageMeta.pageId, index, state: { schema: flattenedData } }));

    const pushStateToStore = (values: Array<Record<string, any>>) => dispatch(addState({ id: pageMeta.pageId, index, state: { schema: values } }));

    const gotoNextSection = () => {
        deleteFilter();
        if (areConflictsResolved(flattenedData)) {
            persistState();
            handleNext();
        } else {
            dispatch(error({ message: 'Please resolve conflicts to proceed further' }));
            setErrorIndex(index)
        }
    }

    const gotoPreviousSection = () => {
        deleteFilter();
        persistState();
        handleBack();
    }

    const columns = useMemo(
        () => [
            {
                Header: 'Field',
                accessor: 'column',
                tipText: 'Name of the field.',
                editable: false,
                Cell: ({ value, cell }: any) => {
                    const row = cell?.row?.original || {};
                    const [edit, setEdit] = useState(false);
                    const [text, setText] = useState('');
                    const editDescription = () => {
                        setEdit((prevState) => !prevState);
                        updateState();
                    }

                    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        setText(e.target.value);
                    }

                    const handleCancel = () => {
                        updateState();
                        setEdit((prevState) => !prevState);
                    }

                    const updateState = () => {
                        setFlattenedData((preState: Array<Record<string, any>>) => {
                            const updatedValues = { ...row };
                            const values = _.map(preState, state => {
                                if (_.get(state, 'column') === _.get(updatedValues, 'column'))
                                    return { ...state, ...updatedValues, isModified: true, description: text };
                                else return state
                            });
                            pushStateToStore(values);
                            return values;
                        });
                    }

                    return (
                        <>
                            <Box alignItems="baseline">
                                <Typography variant="body1" m={1}>
                                    {value}
                                </Typography>
                                {edit &&
                                    <Box my={1} mx={1}>
                                        <TextField
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            autoFocus
                                            defaultValue={row.description}
                                            onBlur={handleCancel}
                                            onChange={handleChange}
                                            label='Description'
                                        />
                                    </Box>
                                }
                                {!edit &&
                                    <Typography
                                        onClick={editDescription}
                                        m={1}
                                        sx={{
                                            overflow: 'hidden',
                                            maxWidth: 230,
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                        variant="subtitle1"
                                        color="secondary"
                                    >{row.description}
                                    </Typography>
                                }
                                {!edit && !row.description && <Box onClick={editDescription} my={1} mx={1}>Add description.. <EditOutlined /></Box>}
                            </Box>
                            {/* {hasCriticalConflicts && !isResolved && <Tooltip title={"Unresolved"}>
                                    <Stack direction="row" spacing={1} m={1}>
                                        {suggestions.map((payload: any, index: number) => {
                                            if (['HIGH', 'CRITICAL'].includes(payload?.severity))
                                                return (<div key={index}>
                                                    {payload?.severity && <Chip size='small' label={payload?.severity} color={_.get(severityToColorMapping, [payload?.severity || "LOW", "color"])} variant='outlined' />}
                                                </div>);
                                            return null;
                                        })}
                                    </Stack>
                                </Tooltip>}
                                {hasCriticalConflicts && isResolved && <Tooltip title={"Resolved"}>
                                    <Stack direction="column" spacing={1} m={1}>
                                        <Chip size='small' label={'Resolved'} color="success" variant='outlined' />
                                    </Stack>
                                </Tooltip>}
                            </Box>
                            <Box alignItems="baseline">
                                {hasCriticalConflicts && !isResolved &&
                                    suggestions.map((payload: any, index: number) => {
                                        if (['HIGH', 'CRITICAL'].includes(payload?.severity))
                                            return (<div key={index}>
                                                <Typography maxWidth={'310px'} color="info.main">{payload?.message}</Typography>
                                            </div>);
                                        return null;
                                    })
                                }
                            </Box> */}
                        </>
                    );
                }
            },
            {
                Header: 'Data type',
                accessor: 'type',
                tipText: 'Data type of the field',
                editable: true,
                disableFilters: true,
                Cell: ({ value, cell }: any) => {
                    const row = cell?.row?.original || {};
                    const hasConflicts = _.get(row, 'suggestions.length');
                    const isResolved = _.get(row, 'resolved') || false;
                    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
                    const updateValue = (val: string) => {
                        setAnchorEl(null);
                        setFlattenedData((preState: Array<Record<string, any>>) => {
                            const updatedValues = { ...row };
                            const values = _.map(preState, state => {
                                if (_.get(state, 'column') === _.get(updatedValues, 'column'))
                                    return { ...state, ...updatedValues, isModified: true, type: val, ...(hasConflicts && { resolved: true }) };
                                else return state
                            });
                            pushStateToStore(values);
                            return values;
                        });
                    }
                    const open = Boolean(anchorEl);

                    const handleSuggestions = (e: React.MouseEvent<HTMLButtonElement>) => {
                        setAnchorEl(e.currentTarget);
                    }

                    const handleClose = () => {
                        setAnchorEl(null);
                    }

                    const renderSuggestions = () => {
                        return row?.oneof?.map((suggestion: any) => {
                            if (suggestion.type !== value) return (
                                <Chip
                                    key={suggestion.type}
                                    aria-label='fix-data-type'
                                    clickable
                                    label={`Convert to ${_.capitalize(suggestion.type)}`}
                                    sx={{ m: 1 }}
                                    color='success'
                                    size="medium"
                                    variant="outlined"
                                    onClick={() => updateValue(suggestion.type)}
                                />
                            );
                            else return null;
                        })
                    }

                    return (
                        <Box position="relative" maxWidth={190} bgcolor={row?.oneof && !isResolved ? "error.light" : ""}>
                            {row?.oneof && !isResolved &&
                                <IconButton sx={{ position: "absolute", right: "0", top: "0", my: 1, mx: 1 }} onClick={handleSuggestions}>
                                    <ExclamationCircleOutlined />
                                </IconButton>
                            }
                            {row?.oneof && isResolved &&
                                <IconButton sx={{ position: "absolute", right: "0", top: "0", my: 1, mx: 1 }} onClick={handleSuggestions}>
                                    <CheckOutlined />
                                </IconButton>
                            }
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <Select
                                    value={value}
                                    variant="standard"
                                >
                                    {
                                        validDatatypes.map((option: any) =>
                                            (<MenuItem onClick={() => updateValue(option)} value={option} key={option}>{option}</MenuItem>))
                                    }
                                </Select>
                            </FormControl>
                            <Popover
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}

                            >
                                <Box sx={{ p: 2 }}>
                                    {isResolved && (
                                        <>
                                            <Typography variant="h6" fontWeight="bold">
                                                Resolved
                                                <Typography variant="body1">
                                                    Data type of field {row?.column} is resolved to "{value}"
                                                </Typography>
                                            </Typography>
                                            {renderSuggestions()}
                                        </>
                                    )}
                                    {!isResolved && (
                                        <>
                                            <Typography variant="h6" fontWeight="bold">
                                                Must-fix
                                                <Typography variant="body1">
                                                    The field {row?.column} has multiple data type values available
                                                </Typography>
                                            </Typography>
                                            {renderSuggestions()}
                                            <Box>
                                                <Chip
                                                    key={`${value}-mark-resolved`}
                                                    aria-label='resolve-data-type'
                                                    clickable
                                                    label={`Mark as resolved`}
                                                    sx={{ m: 1 }}
                                                    color='success'
                                                    variant="outlined"
                                                    size="medium"
                                                    onClick={() => updateValue(value)}
                                                />
                                            </Box>
                                        </>
                                    )}
                                </Box>
                            </Popover>
                        </Box>
                    );
                }
            },
            {
                Header: 'Required',
                accessor: 'required',
                tipText: 'Field is required',
                editable: true,
                disableFilters: true,
                Cell: ({ value, cell }: any) => {
                    const row = cell?.row?.original || {};
                    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        setFlattenedData((preState: Array<Record<string, any>>) => {
                            const updatedValues = { ...row };
                            const values = _.map(preState, state => {
                                if (_.get(state, 'column') === _.get(updatedValues, 'column'))
                                    return { ...state, ...updatedValues, isModified: true, required: e.target.checked };
                                else return state
                            });
                            pushStateToStore(values);
                            return values;
                        });
                    }

                    return (
                        <Box display="flex" alignItems="center">
                            <FormControl fullWidth sx={{ alignItems: 'center' }}>
                                <FormControlLabel
                                    sx={{ m: 'auto' }}
                                    control={<RequiredSwitch defaultChecked onChange={handleChange} />}
                                    label={''}
                                />
                            </FormControl>
                        </Box>
                    );
                }
            },
            {
                Header: 'Actions',
                tipText: 'Perform actions on the field',
                editable: false,
                disableFilters: true,
                Cell: ({ value: initialValue, updateMyData, ...rest }: any) =>
                    <Stack direction="row">
                        <IconButton color="primary" size="large" sx={{ m: 'auto' }} onClick={e => {
                            setOpenAlertDialog(true);
                            setSelection({ value: initialValue, ...rest });
                        }}>
                            <DeleteOutlined style={{ color: "#F04134" }} />
                        </IconButton>
                    </Stack>
            },
        ],
        []
    );

    const [skipPageReset, setSkipPageReset] = useState(false);

    const fetchNonDeletedData = (flattenedData: Array<any>) => _.filter(flattenedData, payload => !_.has(payload, 'isDeleted'));
    const sortBySuggestions = (payload: Array<any>) => _.sortBy(payload, value => value?.suggestions);

    const updateMyData = (rowIndex: number, columnId: any, value: any) => {
        setSkipPageReset(true);
    };

    const handleAlertDialogClose = (status: boolean) => {
        if (selection && status) {
            markRowAsDeleted(selection?.cell?.row?.values);
        }
        setOpenAlertDialog(false);
    }

    const handleFilterChange = (filter: columnFilter) => {
        setFilterByChip(filter);
        setFlattenedData(() => {
            const data = wizardStoreState.pages[pageMeta.pageId].state.schema;
            if (filter.lookup === 'severity') {
                let result: any[] = [];
                _.filter(data, function (item) {
                    return item.suggestions?.map((sv_item: any) => {
                        if (sv_item.severity === filter.id) return result.push(item);
                    })
                });
                return result;
            }
            else return _.filter(data, [filter.lookup, filter.id])
        })
    }

    const deleteFilter = () => {
        setFilterByChip(null);
        const data = wizardStoreState.pages[pageMeta.pageId].state.schema;
        setFlattenedData(data);
        setSkipPageReset(false);
    }

    useEffect(() => {
        if (apiResponse?.status === 'success' && apiResponse?.data?.schema) {
            const flattenedSchema = flattenSchema(apiResponse.data.schema) as any;
            const existingState = pageData?.state?.schema;
            setFlattenedData(existingState || flattenedSchema);
            pushStateToStore(existingState || flattenedSchema);
            setSkipPageReset(false);
        }
    }, [apiResponse?.status]);

    return <>
        <Stack direction="row" spacing={1} marginBottom={2} alignItems="center" justifyContent="space-between">
            <Box display="flex" justifyContent="space-evenly" alignItems="center">
                <Typography>
                    Filter by suggestions:
                </Typography>
                {columnFilters.map((filter) => <Chip
                    key={filter.label}
                    aria-label='filter-issues'
                    clickable
                    label={filter.label}
                    sx={{ mx: 0.5 }}
                    color={filter.color}
                    size="medium"
                    variant="outlined"
                    onClick={() => handleFilterChange(filter)}
                    onDelete={filterByChip?.label === filter.label ? () => deleteFilter() : undefined}
                />
                )}
            </Box>
            <Box display="flex" justifyContent="space-evenly" alignItems="center">
                <IconButtonWithTips
                    tooltipText="Download Schema"
                    icon={<DownloadOutlined />}
                    handleClick={() => { }}
                    buttonProps={{ size: "large" }}
                    tooltipProps={{ arrow: true }}
                />
                <IconButtonWithTips
                    tooltipText="Re-upload Schema"
                    icon={<UploadOutlined />}
                    handleClick={() => { }}
                    buttonProps={{ size: "large" }}
                    tooltipProps={{ arrow: true }}
                />
                <IconButtonWithTips
                    tooltipText="View all suggestions"
                    icon={<FolderViewOutlined />}
                    handleClick={() => { }}
                    buttonProps={{ size: "large" }}
                    tooltipProps={{ arrow: true }}
                />
            </Box>
        </Stack>
        <Grid container spacing={2}>
            {apiResponse?.status !== 'success' &&
                <Grid item xs={12} sm={12}>
                    <Loader />
                </Grid>
            }

            {apiResponse?.status === 'error' &&
                <Grid item xs={12} sm={12}>
                    <Alert severity="error">{apiResponse?.error}</Alert>
                </Grid>
            }

            {apiResponse?.status === 'success' &&
                <>
                    <Grid item xs={12} sm={12}>
                        <MainCard content={false}>
                            <ScrollX>
                                <ReactTable
                                    columns={columns}
                                    data={sortBySuggestions(fetchNonDeletedData(flattenedData)) as []}
                                    updateMyData={updateMyData}
                                    skipPageReset={skipPageReset}
                                    limitHeight
                                />
                            </ScrollX>
                        </MainCard >
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row" justifyContent="space-between">
                            <AnimateButton>
                                <Button variant="contained" sx={{ my: 1, ml: 1 }} type="button" onClick={gotoPreviousSection}>
                                    Previous
                                </Button>
                            </AnimateButton>
                            <AnimateButton>
                                <Button variant="contained" sx={{ my: 1, ml: 1 }} type="button" onClick={gotoNextSection}>
                                    Next
                                </Button>
                            </AnimateButton>
                        </Stack>
                    </Grid>
                    <AlertDialog open={openAlertDialog} handleClose={handleAlertDialogClose} context={alertDialogContext}></AlertDialog>
                </>
            }
        </Grid>
    </>;
};

const mapStateToProps = (state: any) => {
    return {
        wizardStoreState: state?.wizard
    }
}

export default connect(mapStateToProps, {})(ListColumns);
