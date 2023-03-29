import {
    Grid, Button, FormControl, Stack, Paper,
    TextField, IconButton, Autocomplete
} from "@mui/material";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { IWizard } from 'types/formWizard';
import { addState } from 'store/reducers/wizard';
import * as yup from "yup";
import * as _ from 'lodash'
import AnimateButton from "components/@extended/AnimateButton";
import { v4 as uuid4 } from "uuid";

export const pageMeta = { pageId: 'denormConfiguration', title: "Denorm Configuration" };

const DenormConfiguration = ({ handleBack, handleNext, setErrorIndex, index }: any) => {
    const [fields, setFields] = useState<Record<string, string>[]>([]);
    const dispatch = useDispatch();

    const persistState = () => dispatch(addState({ id: pageMeta.pageId, index, state: { configurations: fields } }));

    const handleAddItem = () => {
        const newItem = {
            id: uuid4(),
            fieldValue: '',
            fieldSource: ''
        };
        setFields((prevState: any) => [...prevState, newItem]);
    };

    const handleDeleteItem = (id: string) => {
        const updatedItems = fields.filter((item) => item.id !== id);
        setFields(updatedItems);
    };

    const handleUpdateItemValue = (id: string, value: string) => {
        const updatedItems = fields.map((item) => {
            if (item.id === id) return { ...item, fieldValue: value };
            else return item;
        });
        setFields(updatedItems);
    };

    const handleUpdateItemSource = (id: string, value: string) => {
        const updatedItems = fields.map((item) => {
            if (item.id === id) return { ...item, fieldSource: value };
            else return item;
        });
        setFields(updatedItems);
    };

    const gotoNextSection = () => {
        persistState();
        handleNext();
    }

    const gotoPreviousSection = () => {
        persistState();
        handleBack();
    }

    return (
        <Grid container spacing={3} position="relative">
            {fields.map((item) => (
                <Grid item xs={12} sm={6} md={6} key={item.id}>
                    <Paper sx={{ p: 1, display: 'flex', alignItems: 'center', bgcolor: '#f5f5f5' }} elevation={3}>
                        <FormControl sx={{ mx: 1, width: '50%' }}>
                            <Autocomplete
                                fullWidth
                                options={['id']}
                                value={item.fieldValue}
                                disableClearable
                                renderInput={(params) => <TextField {...params} fullWidth variant="outlined" label="Select field" />}
                                onChange={(event: any, newValue: string) => {
                                    handleUpdateItemValue(item.id, newValue);
                                }}
                            />
                        </FormControl>
                        <FormControl sx={{ mx: 1, width: '50%' }}>
                            <Autocomplete
                                fullWidth
                                options={['master']}
                                value={item.fieldSource}
                                disableClearable
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        fullWidth
                                        variant="outlined"
                                        label="Master datasource"
                                        sx={{ '& .MuiInputLabel-root': { overflowX: 'hidden' } }}
                                    />}
                                onChange={(event: any, newValue: string) => {
                                    handleUpdateItemSource(item.id, newValue);
                                }}
                            />
                        </FormControl>
                        <IconButton onClick={() => handleDeleteItem(item.id)}>
                            <CloseCircleOutlined />
                        </IconButton>
                    </Paper>
                </Grid>
            ))}
            <Grid item xs={12} textAlign="right">
                <Button variant="contained" color="primary" onClick={handleAddItem}>
                    Add Denorm Config
                </Button>
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
        </Grid>
    );

};

export default DenormConfiguration;
