import {
    Box, Chip, Table, TableBody,
    TableCell, TableContainer, TableHead,
    TableRow, Typography, Alert
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

    const dataValidationBox = () => <Box display="flex" alignItems="center" p={1}>
        <Typography ml={2}>Data Validation - </Typography>
        <Chip size='medium' label={_.capitalize(dataValidation)} sx={{ mx: 0.5 }} color="success" variant="filled" />
    </Box>;

    const dedupeBox = () => <Box display="flex" alignItems="center">
        <Typography ml={2}>Dedupe Events - </Typography>
        <Chip size='medium' label={_.capitalize(dedupeConfig)} sx={{ mx: 0.5 }} color="success" variant="filled" />
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
