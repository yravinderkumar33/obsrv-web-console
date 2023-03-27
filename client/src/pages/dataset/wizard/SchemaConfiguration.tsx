import { useEffect, useMemo, useState } from 'react';
import {
    Button, Grid, ToggleButtonGroup, Box,
    Stack, Typography, FormControl,
    ToggleButton, Chip, Alert, FormControlLabel,
    TextField, Autocomplete
} from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import * as _ from 'lodash';
import { DeleteFilled } from '@ant-design/icons';
import ReactTable from 'components/react-table';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'components/Loader';
import AnimateButton from 'components/@extended/AnimateButton';
import { IWizard } from 'types/formWizard';
import { addState } from 'store/reducers/wizard';
import { error } from 'services/toaster';
import { areConflictsResolved, flattenSchema } from 'services/json-schema';
import RequiredSwitch from 'components/RequiredSwitch';
import { connect } from 'react-redux';

const validOpTypes = ['mask', 'encrypt'];
const pageMeta = { pageId: 'dataSchemaConfig', title: "Configure Data Schema" };

interface columnFilter {
    label: string,
    id: string | boolean,
    lookup: string,
    color: "default" | "error" | "warning" | "success" | "primary" | "secondary" | "info"
}

const columnFilters: columnFilter[] = [
    {
        'label': 'Index',
        'id': true,
        'lookup': 'index',
        'color': "info"
    },
    {
        'label': 'PII',
        'id': true,
        'lookup': 'pii',
        'color': "warning"
    },
];

const SchemaConfiguration = ({ handleNext, setErrorIndex, handleBack, index, wizardStoreState }: any) => {
    const dispatch = useDispatch()
    const [flattenedData, setFlattenedData] = useState<Array<Record<string, any>>>([]);
    const apiResponse = useSelector((state: any) => state.jsonSchema);
    const wizardState: IWizard = useSelector((state: any) => state?.wizard);
    const pageData = _.get(wizardState, ['pages', pageMeta.pageId]);
    const [timestampField, setTimestampField] = useState<string>('');
    const [filterByChip, setFilterByChip] = useState<columnFilter | null>(null);

    const persistState = () => dispatch(addState({ id: pageMeta.pageId, index, state: { schema: flattenedData, timestampField: timestampField } }));
    const pushStateToStore = (values: Array<Record<string, any>>) => dispatch(addState({ id: pageMeta.pageId, index, state: { schema: values, timestampField: timestampField } }));

    const gotoNextSection = () => {
        if (areConflictsResolved(flattenedData)) {
            persistState();
            handleNext();
        } else {
            dispatch(error({ message: 'Please resolve conflicts to proceed further' }));
            setErrorIndex(index)
        }
    }

    const gotoPreviousSection = () => {
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
                Cell: ({ value, cell }: any) => (
                    <Box display="flex" alignItems="center">
                        <Typography variant="body1">
                            {value}
                        </Typography>
                    </Box>
                )
            },
            {
                Header: 'Data Type',
                accessor: 'type',
                tipText: 'Data type of the field.',
                editable: false,
                disableFilters: true,
                Cell: ({ value }: any) => (
                    <Box display="flex" alignItems="center">
                        <Typography variant="body1">
                            {value}
                        </Typography>
                    </Box>
                )
            },
            {
                Header: 'Index',
                accessor: 'index',
                tipText: 'Field to be indexed, default indexed on time',
                editable: true,
                disableFilters: true,
                Cell: ({ value, cell }: any) => {
                    const row = cell?.row?.original || {};
                    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        setFlattenedData((preState: Array<Record<string, any>>) => {
                            const updatedValues = { ...row };
                            const values = _.map(preState, state => {
                                if (_.get(state, 'column') === _.get(updatedValues, 'column'))
                                    return { ...state, ...updatedValues, isModified: true, index: e.target.checked };
                                else return state
                            });
                            pushStateToStore(values);
                            return values;
                        });
                    }

                    return (
                        <Box display="flex" alignItems="center">
                            <FormControl sx={{ alignItems: 'center', display: 'block' }}>
                                <FormControlLabel
                                    control={<RequiredSwitch defaultChecked onChange={handleChange} />}
                                    label={''}
                                />
                            </FormControl>
                        </Box>
                    );
                }
            },
            {
                Header: 'PII',
                accessor: 'pii',
                tipText: 'PII Data operations',
                editable: true,
                disableFilters: true,
                Cell: ({ value, cell }: any) => {
                    const row = cell?.row?.original || {};
                    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        setFlattenedData((preState: Array<Record<string, any>>) => {
                            const updatedValues = { ...row };
                            const values = _.map(preState, state => {
                                if (_.get(state, 'column') === _.get(updatedValues, 'column'))
                                    return { ...state, ...updatedValues, isModified: true, pii: { "value": e.target.checked, "op": "" } };
                                else return state
                            });
                            pushStateToStore(values);
                            return values;
                        });
                    }

                    return (
                        <Box alignItems="center" display="flex">
                            <FormControl sx={{ alignItems: 'left', }}>
                                <FormControlLabel
                                    control={<RequiredSwitch onChange={handleChange} />}
                                    label={''}
                                    labelPlacement="bottom"
                                />
                            </FormControl>
                        </Box>
                    );
                }
            },
            {
                Header: 'Actions',
                accessor: 'actions',
                tipText: 'Actions to perform',
                editable: true,
                disableFilters: true,
                Cell: ({ value, cell }: any) => {
                    const row = cell?.row?.original || {};

                    const handleOpChange = (e: React.MouseEvent<HTMLElement, MouseEvent>, val: string) => {
                        setFlattenedData((preState: Array<Record<string, any>>) => {
                            const updatedValues = { ...row };
                            const values = _.map(preState, state => {
                                if (_.get(state, 'column') === _.get(updatedValues, 'column'))
                                    return { ...state, ...updatedValues, isModified: true, pii: { "value": row?.pii?.value, "op": val } };
                                else return state;
                            });
                            pushStateToStore(values);
                            return values;
                        });
                    }

                    return (
                        <Box alignItems="center" display="flex">
                            <ToggleButtonGroup
                                color="info"
                                defaultValue={''}
                                value={row?.pii?.op}
                                exclusive
                                aria-required={'true'}
                                onChange={handleOpChange}
                                aria-label="pii operations"
                            >
                                {validOpTypes.map((opType) => <ToggleButton value={opType}>{_.capitalize(opType)}</ToggleButton>)}
                            </ToggleButtonGroup>

                        </Box>
                    );
                }
            },
            {
                Header: 'Transformations',
                accessor: 'transformation',
                tipText: 'Data Transformations (JSONata Expressions)',
                editable: true,
                disableFilters: true,
                Cell: ({ value, cell }: any) => {
                    const row = cell?.row?.original || {};
                    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        setFlattenedData((preState: Array<Record<string, any>>) => {
                            const updatedValues = { ...row };
                            const values = _.map(preState, state => {
                                if (_.get(state, 'column') === _.get(updatedValues, 'column'))
                                    return { ...state, ...updatedValues, isModified: true, transformation: e.target.value };
                                else return state
                            });
                            pushStateToStore(values);
                            return values;
                        });
                    }

                    return (
                        <Box alignItems="center" display="flex">
                            <TextField
                                type="text"
                                label="Expression"
                                value={value}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                            />
                        </Box>
                    );
                }
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

    const handleFilterChange = (filter: columnFilter) => {
        setFilterByChip(filter);
        setFlattenedData(() => {
            const data = wizardStoreState.pages[pageMeta.pageId].state.schema;
            return _.filter(data, [filter.lookup, filter.id])
        })
    }

    const handleTimeFieldChange = (value: string) => {
        setTimestampField(value);
        persistState();
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
        <Box display="flex" justifyContent={"space-between"}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                {pageMeta.title}
            </Typography>
            <Stack direction="row" spacing={1}>
                {columnFilters.map((filter) => <Chip
                    key={filter.label}
                    aria-label='filter-issues'
                    clickable
                    label={filter.label}
                    sx={{ mx: 0.5 }}
                    color={filterByChip?.label === filter.label ? filter.color : undefined}
                    size="small"
                    onClick={() => handleFilterChange(filter)}
                    deleteIcon={filterByChip?.label === filter.label ? <DeleteFilled /> : undefined}
                    onDelete={filterByChip?.label === filter.label ? () => deleteFilter() : undefined}
                />
                )}
            </Stack>
        </Box>
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
                        <Box my={1} display="flex" alignItems="center">
                            <Typography>Default Timestamp Column -</Typography>
                            <FormControl sx={{ mx: 2, width: '20%' }}>
                                <Autocomplete
                                    value={timestampField}
                                    fullWidth
                                    disablePortal
                                    options={_.map(wizardStoreState.pages[pageMeta.pageId].state.schema, 'column')}
                                    renderInput={(params) => <TextField {...params} label="Column Name.." />}
                                    onChange={(e, value, reason) => handleTimeFieldChange(value)}
                                />
                            </FormControl>
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
    </>;
};

const mapStateToProps = (state: any) => {
    return {
        wizardStoreState: state?.wizard
    }
}

export default connect(mapStateToProps, {})(SchemaConfiguration);
