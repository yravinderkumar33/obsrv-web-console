import React, { useEffect, useMemo, useState } from 'react';
import {
    Button, Grid, IconButton, DialogTitle, Box, Stack, Typography, DialogContent, Dialog, FormControl, Select, MenuItem, TextareaAutosize, FormControlLabel, Chip, Alert, Popover,
} from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import * as _ from 'lodash';
import { CheckOutlined, CloseCircleOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, FolderViewOutlined, InfoCircleOutlined, UploadOutlined, WarningOutlined, } from '@ant-design/icons';
import ReactTable from 'components/react-table';
import { useDispatch, useSelector } from 'react-redux';
import AnimateButton from 'components/@extended/AnimateButton';
import { IWizard } from 'types/formWizard';
import { addState } from 'store/reducers/wizard';
import AlertDialog from 'components/AlertDialog';
import { error } from 'services/toaster';
import { areConflictsResolved, flattenSchema, updateJSONSchema } from 'services/json-schema';
import RequiredSwitch from 'components/RequiredSwitch';
import { connect } from 'react-redux';
import IconButtonWithTips from 'components/IconButtonWithTips';
import { DefaultColumnFilter, SelectBooleanFilter, SelectColumnFilter } from 'utils/react-table';
import CollapsibleSuggestions from './components/CollapsibleSuggestions';
import { downloadJsonFile } from 'utils/downloadUtils';
import { updateClientState } from 'services/dataset';

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
        'label': 'Must-Fix',
        'id': 'MUST-FIX',
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

const ListColumns = ({ handleNext, setErrorIndex, handleBack, index, wizardStoreState, edit }: any) => {
    const [selection, setSelection] = useState<Record<string, any>>({});
    const dispatch = useDispatch();
    const wizardState: IWizard = useSelector((state: any) => state?.wizard);
    const pageData = _.get(wizardState, ['pages', pageMeta.pageId]);
    const [flattenedData, setFlattenedData] = useState<Array<Record<string, any>>>([]);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const [filterByChip, setFilterByChip] = useState<columnFilter | null>(null);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [requiredFieldFilters, setRequiredFieldFilters] = useState<string>('');
    const jsonSchema = _.get(wizardState, 'pages.jsonSchema.schema');

    const markRowAsDeleted = (cellValue: Record<string, any>) => {
        const column = cellValue?.column;
        if (column) {
            setFlattenedData((preState: Array<Record<string, any>>) => {
                const data = _.map(preState, payload => {
                    return {
                        ...payload,
                        ...(_.get(payload, 'column') === column && {
                            isModified: true,
                            isDeleted: true,
                            resolved: true,
                        })
                    };
                });
                persistState(data);
                return data;
            });
        }
    }

    const persistClientState = async () => {
        try {
            await updateClientState({ clientState: wizardState });
        } catch (err) {
            dispatch(error({ message: 'Failed to update state' }));
        }
    }

    const persistState = (data?: any) => dispatch(addState({ id: pageMeta.pageId, index, state: { schema: data || flattenedData } }));

    const gotoNextSection = () => {
        const data = deleteFilter();
        if (areConflictsResolved(flattenedData)) {
            persistState(data);
            persistClientState();
            handleNext();
        } else {
            dispatch(error({ message: 'Please resolve conflicts to proceed further' }));
            setErrorIndex(index)
        }
    }

    const gotoPreviousSection = () => {
        const data = deleteFilter();
        persistState(data);
        persistClientState();
        handleBack();
    }

    const columns = useMemo(
        () => [
            {
                Header: 'Field',
                accessor: 'column',
                tipText: 'Name of the field.',
                editable: false,
                Filter: DefaultColumnFilter,
                filter: 'includes',
                Cell: ({ value, cell }: any) => {
                    const row = cell?.row?.original || {};
                    const [edit, setEdit] = useState(false);
                    const [text, setText] = useState('');
                    const editDescription = () => {
                        setEdit((prevState) => !prevState);
                        updateState();
                    }

                    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setText(e.target.value);
                    }

                    const updateState = () => {
                        setFlattenedData((preState: Array<Record<string, any>>) => {
                            const updatedValues = { ...row };
                            const values = _.map(preState, state => {
                                if (_.get(state, 'column') === _.get(updatedValues, 'column'))
                                    return { ...state, ...updatedValues, isModified: true, description: text };
                                else return state
                            });
                            persistState(values);
                            return values;
                        });
                    }

                    return (
                        <Box alignItems="baseline">
                            <Typography variant="body1" m={1} onClick={editDescription}>
                                {value} {
                                    row.description ?
                                        <IconButtonWithTips
                                            icon={<InfoCircleOutlined />}
                                            tooltipProps={{ arrow: true }}
                                            buttonProps={{ size: "small" }}
                                            tooltipText={row.description}
                                        /> :
                                        <IconButtonWithTips
                                            icon={<EditOutlined />}
                                            tooltipProps={{ arrow: true }}
                                            buttonProps={{ size: "small" }}
                                            tooltipText={"Click to edit description"}
                                        />

                                }
                            </Typography>
                            <Dialog open={edit} onClose={editDescription}>
                                <DialogTitle
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Typography mx={2}>
                                        Add description for {value} field
                                    </Typography>
                                    <CloseCircleOutlined onClick={editDescription} />
                                </DialogTitle>
                                <DialogContent>
                                    <Box m={2}>
                                        <TextareaAutosize
                                            minRows={3}
                                            style={{ width: 250 }}
                                            autoFocus
                                            defaultValue={row.description}
                                            aria-label="description of field"
                                            onChange={handleChange}
                                            placeholder="Add description here..."
                                        />
                                    </Box>
                                </DialogContent>
                            </Dialog>
                        </Box>
                    );
                }
            },
            {
                Header: 'Data type',
                accessor: 'type',
                tipText: 'Data type of the field',
                editable: true,
                Filter: DefaultColumnFilter,
                filter: 'includes',
                Cell: ({ value, cell }: any) => {
                    const row = cell?.row?.original || {};
                    const hasConflicts = _.get(row, 'suggestions.length');
                    const isResolved = _.get(row, 'resolved') || false;
                    const pageData: any = useSelector((state: any) => state?.wizard?.pages[pageMeta.pageId].state?.schema);
                    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | HTMLElement | null>(null);
                    const updateValue = (val: string) => {
                        const updatedValues = { ...row };
                        const storeState = _.cloneDeep(pageData);
                        const data = _.map(storeState, state => {
                            if (_.get(state, 'column') === _.get(updatedValues, 'column'))
                                return { ...state, ...updatedValues, isModified: true, type: val, ...(hasConflicts && { resolved: true }) };
                            else return state
                        });
                        persistState(data);
                        setFlattenedData((preState: Array<Record<string, any>>) => {
                            const filteredData = _.map(preState, state => {
                                if (_.get(state, 'column') === _.get(updatedValues, 'column'))
                                    return { ...state, ...updatedValues, isModified: true, type: val, ...(hasConflicts && { resolved: true }) };
                                else return state;
                            });
                            return filteredData;
                        });
                        setAnchorEl(null);
                    }
                    const open = Boolean(anchorEl);

                    const handleSuggestions = (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLElement>) => {
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
                        <Box position="relative" maxWidth={180} display="flex" alignItems="center">
                            {row?.oneof && !isResolved &&
                                <IconButton sx={{ position: "absolute", right: "0", top: "0", my: 0.5, mx: 0.5 }} color="error" onClick={handleSuggestions}>
                                    <WarningOutlined />
                                </IconButton>
                            }
                            {row?.oneof && isResolved &&
                                <IconButton sx={{ position: "absolute", right: "0", top: "0", my: 0.5, mx: 0.5 }} color="success" onClick={handleSuggestions}>
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
                Filter: SelectBooleanFilter,
                filter: 'equals',
                customValue: requiredFieldFilters,
                Cell: ({ value, cell, updateMyData }: any) => {
                    const row = cell?.row?.original || {};
                    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        setFlattenedData((preState: Array<Record<string, any>>) => {
                            const updatedValues = { ...row };
                            const values = _.map(preState, state => {
                                if (_.get(state, 'column') === _.get(updatedValues, 'column'))
                                    return { ...state, ...updatedValues, isModified: true, required: e.target.checked };
                                else return state
                            });
                            persistState(values);
                            return values;
                        });
                    }
                    switch (value) {
                        default:
                            return <Box display="flex" alignItems="center">
                                <FormControl fullWidth sx={{ alignItems: 'center' }}>
                                    <FormControlLabel
                                        sx={{ m: 'auto' }}
                                        control={<RequiredSwitch checked={value} onChange={handleChange} />}
                                        label={''}
                                    />
                                </FormControl>
                            </Box>;
                    }
                }
            },
            {
                Header: 'Actions',
                tipText: 'Perform actions on the field',
                editable: false,
                disableFilters: true,
                Filter: SelectColumnFilter,
                filter: 'equals',
                Cell: ({ value, cell, ...rest }: any) => {
                    const row = cell?.row?.original || {};
                    const handleDeleteColumn = () => {
                        setSelection(row);
                        setOpenAlertDialog(true);
                    }

                    return (
                        <Stack direction="row">
                            <IconButton color="primary" size="large" sx={{ m: 'auto' }} onClick={handleDeleteColumn}>
                                <DeleteOutlined style={{ color: "#F04134" }} />
                            </IconButton>
                        </Stack>
                    );
                }
            },
        ],
        [requiredFieldFilters]
    );

    const handleDownloadButton = () => {
        if (jsonSchema && flattenedData) {
            const data = updateJSONSchema(jsonSchema, flattenedData);
            downloadJsonFile(data, 'json-schema');
        }
    }

    const [skipPageReset, setSkipPageReset] = useState(false);

    const fetchNonDeletedData = (flattenedData: Array<any>) => _.filter(flattenedData, payload => !_.has(payload, 'isDeleted'));
    const sortBySuggestions = (payload: Array<any>) => _.sortBy(payload, value => value?.suggestions);

    const updateMyData = (rowIndex: number, columnId: any, value: any) => {
        setSkipPageReset(true);
    };

    const handleAlertDialogClose = () => {
        setOpenAlertDialog(false);
    }

    const handleAlertDialogAction = () => {
        if (selection) {
            markRowAsDeleted(selection);
            setSelection({});
        }
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
        persistState(data);
        setFlattenedData(data);
        return data;
    }

    const handleSuggestionsView = () => {
        setShowSuggestions((prevState) => !prevState);
    }

    useEffect(() => {
        if (jsonSchema) {
            const flattenedSchema = flattenSchema(jsonSchema) as any;
            const existingState = pageData?.state?.schema;
            setFlattenedData(existingState || flattenedSchema);
            persistState(existingState || flattenedSchema);
            persistClientState();
            setSkipPageReset(false);
        }
    }, [jsonSchema]);

    return <>
        <Stack direction="row" spacing={1} marginBottom={1} alignItems="center" justifyContent="space-between">
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
                    handleClick={handleDownloadButton}
                    buttonProps={{ size: "large", sx: { color: "#000" } }}
                    tooltipProps={{ arrow: true }}
                />

                <IconButtonWithTips
                    tooltipText="View all suggestions"
                    icon={<FolderViewOutlined />}
                    handleClick={handleSuggestionsView}
                    buttonProps={{ size: "large", sx: { color: "#000" } }}
                    tooltipProps={{ arrow: true }}
                />
            </Box>
        </Stack>
        
        <CollapsibleSuggestions
            flattenedData={flattenedData}
            showSuggestions={showSuggestions}
            setRequiredFilter={setRequiredFieldFilters}
            requiredFilter={requiredFieldFilters}
        />
        <Grid container spacing={2}>
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
                <Stack direction="row" justifyContent={edit ? 'flex-end' : 'space-between'}>
                    {!edit && <AnimateButton>
                        <Button variant="contained" sx={{ my: 1, ml: 1 }} type="button" onClick={gotoPreviousSection}>
                            Previous
                        </Button>
                    </AnimateButton>}
                    <AnimateButton>
                        <Button variant="contained" sx={{ my: 1, ml: 1 }} type="button" onClick={gotoNextSection}>
                            Next
                        </Button>
                    </AnimateButton>
                </Stack>
            </Grid>
            <AlertDialog open={openAlertDialog} action={handleAlertDialogAction} handleClose={handleAlertDialogClose} context={alertDialogContext} />
        </Grid>
    </>;
};

const mapStateToProps = (state: any) => {
    return {
        wizardStoreState: state?.wizard
    }
}

export default connect(mapStateToProps, {})(ListColumns);
