import {
    Box, Table, TableBody, Chip,
    TableCell, TableContainer, TableHead,
    TableRow, Typography, Alert,
} from '@mui/material';
import MainCard from 'components/MainCard';
import { useSelector } from 'react-redux';
import * as _ from "lodash";
import { WarningOutlined } from '@ant-design/icons';

const displayBatchColumns = [
    { id: 'extractionKey', label: 'Extraction Key' },
    { id: 'batchId', label: 'Batch ID' },
    { id: 'dedupeRequired', label: 'Dedupe Required' },
    { id: 'dedupeKey', label: 'Dedupe Key' },
    { id: 'dedupePeriod', label: 'Dedupe Period' },
];

const Preview = () => {
    const wizardState: any = useSelector((state: any) => state?.wizard);
    const dataSourceConfig: any = _.get(wizardState, ['pages', 'dataSource']);
    const dataFormatConfig: any = _.get(wizardState, ['pages', 'dataFormat']);

    const dataSourceTable = () => <MainCard content={false} title="Dataset Configurations">
        <Box display="flex" alignItems="center" p={1}>
            <Typography ml={2}>Chosen Datasources - {' '}</Typography>
            {dataSourceConfig.formFieldSelection.map((item: any) => (
                <Chip size='medium' label={_.capitalize(item)} sx={{ mx: 0.5 }} color="success" variant="filled" />
            ))}
        </Box>
        <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Kafka Topic
                        </TableCell>
                        <TableCell>
                            Kafka Broker URLs
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            {dataSourceConfig.value.topic}
                        </TableCell>
                        <TableCell>
                            {dataSourceConfig.value.kafkaBrokers}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    </MainCard >;

    const dataFormatTable = () => <MainCard content={false} title="Data Format Configurations" sx={{ my: 2 }}>
        <Box display="flex" alignItems="center" p={1}>
            <Typography ml={2}>Batch Mode - {' '}</Typography>
            <Chip size='medium' label={_.capitalize(dataFormatConfig.value.type)} sx={{ mx: 0.5 }} color="success" variant="filled" />
        </Box>
        <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        {displayBatchColumns.map((item: any) => (
                            <TableCell key={item.id}>
                                {item.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        {displayBatchColumns.map((keyName: any) => (
                            <TableCell key={keyName.id}>
                                {dataFormatConfig.value[keyName.id]}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    </MainCard >;

    if (dataSourceConfig || dataFormatConfig)
        return (
            <>
                {dataSourceConfig && dataSourceTable()}
                {dataFormatConfig && dataFormatTable()}
            </>
        );
    else return (<Alert color="error" icon={<WarningOutlined />}>No information to display</Alert>);
}

export default Preview;
