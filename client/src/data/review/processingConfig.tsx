import {
    Box, ToggleButton, Table, TableBody,
    TableCell, TableContainer, TableHead,
    TableRow, ToggleButtonGroup, Typography,
    Alert
} from '@mui/material';
import MainCard from 'components/MainCard';
import { useSelector } from 'react-redux';
import * as _ from "lodash";
import { WarningOutlined } from '@ant-design/icons';

const Preview = () => {
    const wizardState: any = useSelector((state: any) => state?.wizard);
    const dataValidation: any = _.get(wizardState, ['pages', 'dataValidation', 'formFieldSelection']);
    const dedupeConfig: any = _.get(wizardState, ['pages', 'dedupe', 'questionSelection', 'dedupeEvents']);
    const dedupeOptionConfig: any = _.get(wizardState, ['pages', 'dedupe', 'optionSelection']);

    const dataValidationBox = () => <Box display="flex" alignItems="center">
        <Typography ml={2}>Data Validation - </Typography>
        <ToggleButtonGroup sx={{ mx: 1, my: 1 }} color='success' value={dataValidation}>
            <ToggleButton value={dataValidation} key={dataValidation}>{dataValidation}</ToggleButton>
        </ToggleButtonGroup>
    </Box>;

    const dedupeBox = () => <Box display="flex" alignItems="center">
        <Typography ml={2}>Dedupe Events - </Typography>
        <ToggleButtonGroup sx={{ mx: 1, my: 1 }} color='success' value={dedupeConfig}>
            <ToggleButton value={dedupeConfig} key={dedupeConfig}>{dedupeConfig}</ToggleButton>
        </ToggleButtonGroup>
    </Box>;

    const dedupeOptionTable = () => <TableContainer>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
                <TableRow>
                    {Object.keys(dedupeOptionConfig).map((item: any) => (
                        <TableCell key={item}>
                            {item}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    {Object.values(dedupeOptionConfig).map((item: any) => (
                        <TableCell key={item}>
                            {item}
                        </TableCell>
                    ))}
                </TableRow>
            </TableBody>
        </Table>
    </TableContainer>;

    if (dataValidation || dedupeConfig || dedupeOptionConfig)
        return (
            <MainCard content={false} title="Processing Configurations" sx={{ my: 2 }}>
                {dataValidation && dataValidationBox()}
                {dedupeConfig && dedupeBox()}
                {dedupeOptionConfig && dedupeOptionTable()}
            </MainCard >
        );
    else return (<Alert color="error" icon={<WarningOutlined />}>No information to display</Alert>);
}

export default Preview;
