import React, { useEffect, useMemo, useState } from 'react';
import {
    Button, Grid, Box, Stack,
    Typography, Chip, useTheme
} from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import * as _ from 'lodash';
import { CloseOutlined, FolderViewOutlined, } from '@ant-design/icons';
import ReactTable from 'components/react-table';
import { useDispatch, useSelector } from 'react-redux';
import { IWizard } from 'types/formWizard';
import { addState } from 'store/reducers/wizard';
import AlertDialog from 'components/AlertDialog';
import { error } from 'services/toaster';
import { areConflictsResolved, flattenSchema, updateJSONSchema } from 'services/json-schema';
import { connect } from 'react-redux';
import IconButtonWithTips from 'components/IconButtonWithTips';
import { DefaultColumnFilter, SelectBooleanFilter, SelectColumnFilter } from 'utils/react-table';
import CollapsibleSuggestions from './components/CollapsibleSuggestions';
import { downloadJsonFile } from 'utils/downloadUtils';
import { updateClientState } from 'services/dataset';
import { CardTitle, GenericCard } from 'components/styled/Cards';
import WizardNavigator from './components/WizardNavigator';
import { resetDataTypeResolve, updateDataType } from './utils/dataTypeUtil';
import { renderActionsCell, renderColumnCell, renderDataTypeCell, renderRequiredCell } from './utils/renderCells';

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
    const theme = useTheme();

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
                    const [edit, setEdit] = useState(false);
                    const [text, setText] = useState('');
                    return renderColumnCell({
                        cell, value, persistState, setFlattenedData,
                        theme, text, setText, edit, setEdit
                    });
                }
            },
            {
                Header: 'Data type',
                accessor: 'type',
                tipText: 'Data type of the field',
                errorBg: true,
                editable: true,
                Filter: DefaultColumnFilter,
                filter: 'includes',
                Cell: ({ value, cell }: any) => {
                    const pageData: any = useSelector((state: any) => state?.wizard?.pages[pageMeta.pageId].state?.schema);
                    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | HTMLElement | null>(null);
                    return renderDataTypeCell({
                        cell, value, pageData, anchorEl, setAnchorEl,
                        updateDataType, persistState, setFlattenedData,
                        resetDataTypeResolve, validDatatypes
                    });
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
                Cell: ({ value, cell, updateMyData }: any) => renderRequiredCell({
                    cell, value, setFlattenedData, persistState,
                })
            },
            {
                Header: 'Actions',
                tipText: 'Perform actions on the field',
                editable: false,
                disableFilters: true,
                Filter: SelectColumnFilter,
                filter: 'equals',
                Cell: ({ value, cell, ...rest }: any) => renderActionsCell({
                    cell, value, setSelection, setOpenAlertDialog, theme,
                })
            },
        ],
        [requiredFieldFilters]
    );

    const handleDownloadButton = () => {
        const data = updateJSONSchema(jsonSchema, flattenedData);
        downloadJsonFile(data, 'json-schema');
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
                        if (sv_item.severity === filter.id && !item.resolved)
                            return result.push(item);
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

    return (
        <>
            <GenericCard elevation={1}>
                <CardTitle fontWeight={400}>1- Schema Details</CardTitle>
                <Stack direction="row" spacing={1} marginBottom={1} alignItems="center" justifyContent="space-between">
                    <Box display="flex" justifyContent="space-evenly" alignItems="center">
                        <Typography variant="body2" color="secondary" mr={1}>
                            Filter Suggestion by:
                        </Typography>
                        {columnFilters.map((filter) => <Chip
                            key={filter.label}
                            aria-label='filter-button'
                            clickable
                            label={filter.label}
                            sx={{ mx: 0.5 }}
                            color={filter.color}
                            size="medium"
                            variant="outlined"
                            onClick={() => handleFilterChange(filter)}
                        />
                        )}
                        {filterByChip &&
                            <Button size="medium" onClick={deleteFilter} startIcon={<CloseOutlined />} sx={{ fontWeight: 500 }}>
                                Clear filters
                            </Button>
                        }
                    </Box>
                    <Box display="flex" justifyContent="space-evenly" alignItems="center">
                        <IconButtonWithTips
                            tooltipText="View all suggestions"
                            icon={<FolderViewOutlined style={{ fontSize: '1.25rem' }} />}
                            handleClick={handleSuggestionsView}
                            buttonProps={{ size: "large" }}
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
                                    tHeadHeight={52}
                                />
                            </ScrollX>
                        </MainCard >
                    </Grid>
                    <AlertDialog open={openAlertDialog} action={handleAlertDialogAction} handleClose={handleAlertDialogClose} context={alertDialogContext} />
                </Grid>
            </GenericCard>
            <WizardNavigator
                showPrevious={edit}
                gotoPreviousSection={gotoPreviousSection}
                gotoNextSection={gotoNextSection}
                enableDownload
                handleDownload={handleDownloadButton}
            />
        </>
    );
};

const mapStateToProps = (state: any) => {
    return {
        wizardStoreState: state?.wizard
    }
}

export default connect(mapStateToProps, {})(ListColumns);
