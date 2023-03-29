import {
    Grid, Button, FormControl, Stack, Paper,
    Box, TextField, Typography,
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

export const pageMeta = { pageId: 'advancedConfiguration', title: "Advanced Configuration" };

const AdvancedConfiguration = ({ handleBack, handleNext, setErrorIndex, index }: any) => {
    const [advancedConfig, setAdvancedConfig] = useState<Record<string, string>>({
        retention: '',

    });
    const dispatch = useDispatch();

    const persistState = () => dispatch(addState({ id: pageMeta.pageId, index, state: { configurations: advancedConfig } }));

    const gotoNextSection = () => {
        persistState();
        handleNext();
    }

    const gotoPreviousSection = () => {
        persistState();
        handleBack();
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAdvancedConfig((prevState: any) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }

    return (
        <Grid container spacing={3} position="relative">
            <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                    <Box my={1} display="flex" alignItems="center">
                        <Typography mx={1} minWidth="210px">Default Datasource Configuration </Typography>
                        <FormControl sx={{ width: '210px', maxWidth: '210px' }}>
                            <TextField
                                name={'retention'}
                                label={'Retention period in Days'}
                                defaultValue={0}
                                type="number"
                                onChange={handleChange}
                                required
                                variant="outlined"
                                fullWidth
                            />
                        </FormControl>
                    </Box>
                </Paper>
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

export default AdvancedConfiguration;
