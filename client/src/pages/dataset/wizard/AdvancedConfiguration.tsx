import {
    Accordion, AccordionDetails, AccordionSummary,
    Typography, Grid, Box, Button, FormControl, FormControlLabel,
    Stack
} from "@mui/material";
import { CheckCircleOutlined } from "@ant-design/icons";
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

const AdvancedConfiguration = ({ handleBack, handleNext, setErrorIndex, index, configuration, pageMeta }: any) => {

};

export default AdvancedConfiguration;
