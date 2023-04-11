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
    const dataSourceConfig: any = _.get(wizardState, ['pages', 'dataSource']);

    const dataSourceTable = () => <MainCard content={false} title="Dataset Configurations">
        <Box display="flex" alignItems="center">
            <Typography ml={2}>Chosen Datasources - {' '}</Typography>
            <ToggleButtonGroup sx={{ mx: 1, my: 1 }} color='success' value={dataSourceConfig.formFieldSelection}>
                {dataSourceConfig.formFieldSelection.map((item: any) => (
                    <ToggleButton value={item} key={item}>{item}</ToggleButton>
                ))}
            </ToggleButtonGroup>
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
    if (dataSourceConfig)
        return (
            <>
                {dataSourceTable()}
            </>
        );
    else return (<Alert color="info" icon={<WarningOutlined />}>No information to display</Alert>);
}

export default Preview;
