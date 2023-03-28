import {
    Typography, Grid, Box, Button, FormControl,
    FormControlLabel, Stack, Paper, TextField,
    IconButton
} from "@mui/material";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import MUIForm from "components/form";
import { useDispatch, useSelector } from 'react-redux';
import { IWizard } from 'types/formWizard';
import { addState } from 'store/reducers/wizard';
import * as yup from "yup";
import * as _ from 'lodash'
import RequiredSwitch from "components/RequiredSwitch";
import AnimateButton from "components/@extended/AnimateButton";
import { camelCaseToString } from "utils/stringUtils";
import { v4 as uuid4 } from "uuid";

const DenormConfiguration = ({ handleBack, handleNext, setErrorIndex, index, configuration, pageMeta }: any) => {
    const [fields, setFields] = useState<Record<string, string>[]>([]);

    const handleAddItem = () => {
        const newItem = {
            id: uuid4(),
            value: '',
        };
        setFields((prevState: any) => [...prevState, newItem]);
    };

    const handleDeleteItem = (id: string) => {
        const updatedItems = fields.filter((item) => item.id !== id);
        setFields(updatedItems);
    };

    const handleUpdateItemValue = (id: string, value: string) => {
        const updatedItems = fields.map((item) => {
            if (item.id === id) return { ...item, value };
            else return item;
        });
        setFields(updatedItems);
    };

    return (
        <Grid container spacing={3}>
            {fields.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Paper sx={{ p: 1 }}>
                        <TextField
                            label="Field Name"
                            value={item.value}
                            onChange={(e) => handleUpdateItemValue(item.id, e.target.value)}
                        />
                        <IconButton onClick={() => handleDeleteItem(item.id)}>
                            <CloseCircleOutlined />
                        </IconButton>
                    </Paper>
                </Grid>
            ))}
            <Grid item xs={12} sm={6} md={4}>
                <Button variant="contained" color="primary" onClick={handleAddItem}>
                    Add Item
                </Button>
            </Grid>
        </Grid>
    );

};

export default DenormConfiguration;
