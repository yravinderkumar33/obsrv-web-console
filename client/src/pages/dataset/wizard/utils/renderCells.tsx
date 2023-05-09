import React from "react";
import {
    Box, Typography, Button, Dialog, DialogTitle, Select,
    DialogContent, TextareaAutosize, FormControl, MenuItem,
    Popover, FormControlLabel, Stack, IconButton,
} from "@mui/material";
import RequiredSwitch from "components/RequiredSwitch";
import {
    CloseCircleOutlined, PlusOutlined, CheckOutlined,
    DeleteOutlined, InfoCircleOutlined,
} from '@ant-design/icons';
import * as _ from "lodash";
import HtmlTooltip from "components/HtmlTooltip";
import { VerticalOverflowText } from "components/styled/Typography";

const renderColumnCell = ({
    cell, setFlattenedData, persistState, value,
    theme, edit, setEdit, text, setText
}: any) => {
    const row = cell?.row?.original || {};
    const editDescription = () => {
        updateState();
        setEdit((prevState: any) => !prevState);
    }

    const handleClose = () => {
        setEdit((prevState: any) => !prevState);
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    }

    const updateState = () => {
        setFlattenedData((preState: Array<Record<string, any>>) => {
            const updatedValues = { ...row };
            const values = _.map(preState, state => {
                if (_.get(state, 'column') === _.get(updatedValues, 'originalColumn'))
                    return { ...state, ...updatedValues, isModified: true, description: text, column: _.get(updatedValues, 'originalColumn') };
                else return state;
            });
            persistState(values);
            return values;
        });
    }

    return (
        <Box alignItems="baseline" maxWidth={'40vw'} minWidth={'40vw'} paddingLeft={cell?.row?.depth > 0 ? 2 : 0}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <HtmlTooltip title={value}>
                    <Typography variant="h6" my={1} maxWidth={'70%'} textOverflow='ellipsis' overflow='hidden' whiteSpace='nowrap'>
                        {cell?.row?.depth > 0 ? '- ' : ''}{value}
                    </Typography>
                </HtmlTooltip>
                {!row.description &&
                    <Button sx={{ fontWeight: 500 }} onClick={handleClose} startIcon={<PlusOutlined style={{ fontSize: '1.25rem', strokeWidth: 25, stroke: theme.palette.primary.main }} />}>
                        Description
                    </Button>
                }
            </Box>
            {row.description &&
                <HtmlTooltip title={row.description} placement="top-start" arrow>
                    <VerticalOverflowText
                        variant="body3"
                        color="secondary"
                        onClick={handleClose}
                    >
                        {row.description}
                    </VerticalOverflowText>
                </HtmlTooltip>
            }
            <Dialog open={edit} onClose={handleClose}>
                <DialogTitle
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <HtmlTooltip title={value}>
                        <Typography mx={2} maxWidth={'70%'} textOverflow='ellipsis' overflow='hidden' whiteSpace='nowrap'>
                            {value}
                        </Typography>
                    </HtmlTooltip>
                    <CloseCircleOutlined onClick={handleClose} />
                </DialogTitle>
                <DialogContent>
                    <Box m={2}>
                        <TextareaAutosize
                            minRows={3}
                            style={{ width: '31.25rem', height: '6.875rem' }}
                            autoFocus
                            defaultValue={row.description}
                            aria-label="description of field"
                            onChange={handleChange}
                            placeholder="Add description here..."
                        />
                    </Box>
                    <Box display='flex' justifyContent='flex-end'>
                        <Button sx={{ my: 1, mx: 2, width: 230 }} onClick={editDescription} variant="contained">
                            <Typography variant="body1" fontWeight={500}>
                                Save
                            </Typography>
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}

const renderDataTypeCell = ({
    cell, value, pageData, anchorEl, setAnchorEl,
    updateDataType, persistState, setFlattenedData,
    resetDataTypeResolve, validDatatypes, disabled,
}: any) => {
    const row = cell?.row?.original || {};
    const hasConflicts = _.get(row, 'suggestions.length');
    const isResolved = _.get(row, 'resolved') || false;
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
                <Button
                    key={suggestion.type}
                    aria-label='fix-data-type'
                    variant="contained"
                    sx={{ my: 1 }}
                    onClick={() => updateDataType(
                        suggestion.type, row, pageData, persistState,
                        setFlattenedData, hasConflicts, setAnchorEl,
                    )}
                >
                    <Typography variant="body1" fontWeight={500}>
                        {`Change Data Type to ${_.capitalize(suggestion.type)}`}
                    </Typography>
                </Button>
            );
            else return null;
        })
    }

    if (disabled) return (
        <Box px={2}><Typography variant="h6">{value}</Typography></Box>
    );

    return (
        <Box position="relative" maxWidth={180} display='block' alignItems="center" my={1}>
            {row?.oneof && !isResolved &&
                <Button startIcon={<InfoCircleOutlined />} color="error" onClick={handleSuggestions} sx={{ mx: 1 }}>
                    <Typography variant="caption">Recommended Change</Typography>
                </Button>
            }
            {row?.oneof && isResolved &&
                <Button startIcon={<CheckOutlined />} color="success" onClick={handleSuggestions} sx={{ mx: 1 }}>
                    <Typography variant="caption">Resolved</Typography>
                </Button>
            }
            < FormControl variant="standard" sx={{ mx: 1, minWidth: 120 }}>
                <Select
                    value={value}
                    variant="standard"
                >
                    {
                        validDatatypes.map((option: any) =>
                        (
                            <MenuItem
                                onClick={() => updateDataType(
                                    option, row, pageData, persistState,
                                    setFlattenedData, hasConflicts, setAnchorEl,
                                )}
                                value={option}
                                key={option}>
                                {option}
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl >
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box p={2} maxWidth={336}>
                    {isResolved && (
                        <>
                            <Typography variant="h6" fontWeight="bold">
                                Resolved
                                <Typography variant="body1" my={2}>
                                    Data type of field {row?.column} is resolved to "{value}"
                                </Typography>
                            </Typography>
                            <Box my={1}>
                                <Button
                                    key={`${value}-mark-resolved`}
                                    aria-label='resolve-data-type'
                                    variant="contained"
                                    onClick={() => resetDataTypeResolve(
                                        row, pageData, persistState, setFlattenedData,
                                        hasConflicts, setAnchorEl,
                                    )}
                                >
                                    <Typography variant="body1" fontWeight={500}>
                                        Reopen Suggestion
                                    </Typography>
                                </Button>
                            </Box>
                        </>
                    )}
                    {!isResolved && (
                        <>
                            <Typography variant="h6" fontWeight="bold">
                                Must-Fix
                                <Typography variant="body1" my={2}>
                                    The field {row?.column} has multiple data type values available
                                </Typography>
                            </Typography>
                            {renderSuggestions()}
                            <Box my={1}>
                                <Button
                                    key={`${value}-mark-resolved`}
                                    aria-label='resolve-data-type'
                                    onClick={() => updateDataType(
                                        value, row, pageData, persistState,
                                        setFlattenedData, hasConflicts, setAnchorEl,
                                    )}
                                >
                                    <Typography variant="body1" fontWeight={500}>
                                        Mark as resolved
                                    </Typography>
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Popover>
        </Box >
    );
}

const renderRequiredCell = ({
    cell, value, setFlattenedData, persistState,
}: any) => {
    const row = cell?.row?.original || {};
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFlattenedData((preState: Array<Record<string, any>>) => {
            const updatedValues = { ...row };
            const values = _.map(preState, state => {
                if (_.get(state, 'column') === _.get(updatedValues, 'originalColumn'))
                    return { ...state, ...updatedValues, isModified: true, required: e.target.checked, column: _.get(updatedValues, 'originalColumn') };
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
                        control={<RequiredSwitch size='small' checked={value} onChange={handleChange} />}
                        label={''}
                    />
                </FormControl>
            </Box>;
    }
}

const renderActionsCell = ({ cell, value, setSelection, setOpenAlertDialog, theme }: any) => {
    const row = cell?.row?.original || {};
    const handleDeleteColumn = () => {
        setSelection(row);
        setOpenAlertDialog(true);
    }

    return (
        <Stack direction="row">
            <IconButton color="primary" size="large" sx={{ m: 'auto' }} onClick={handleDeleteColumn}>
                <DeleteOutlined style={{ color: theme.palette.primary.main }} />
            </IconButton>
        </Stack>
    );
}

export { renderColumnCell, renderDataTypeCell, renderRequiredCell, renderActionsCell };
