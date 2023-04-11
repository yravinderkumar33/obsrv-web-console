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
    const dataFormatConfig: any = _.get(wizardState, ['pages', 'dataFormat']);

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

    const dataFormatTable = () => <MainCard content={false} title="Data Format Configurations" sx={{ my: 2 }}>
        <Box display="flex" alignItems="center">
            <Typography ml={2}>Chosen Datasources - {' '}</Typography>
            <ToggleButtonGroup sx={{ mx: 1, my: 1 }} color='success' value={dataFormatConfig.value.type}>
                {dataFormatConfig.formFieldSelection.map((item: any) => (
                    <ToggleButton value={item} key={item}>{item}</ToggleButton>
                ))}
            </ToggleButtonGroup>
        </Box>
        <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        {Object.keys(dataFormatConfig.value).map((item: any) => item !== 'id' && (
                            <TableCell key={item}>
                                {item}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        {Object.entries(dataFormatConfig.value).map(([k, v]: any) => k !== 'id' && (
                            <TableCell key={v}>
                                {v}
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
