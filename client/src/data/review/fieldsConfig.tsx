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

const displayColumns = [
    { id: 'column', label: 'Column' },
    { id: 'transformation', label: 'Transform Expression' },
    { id: '_transformationType', label: 'Transformation Type' },
];

const Preview = () => {
    const wizardState: any = useSelector((state: any) => state?.wizard);
    const timestampCol: any = _.get(wizardState, ['pages', 'timestamp', 'indexCol']);
    console.log(timestampCol);
    const piiFields: any = _.get(wizardState, ['pages', 'pii', 'selection']) || [];
    const transformationFields: any = _.get(wizardState, ['pages', 'transformation', 'selection']) || [];
    const additionalFields: any = _.get(wizardState, ['pages', 'additionalFields', 'selection']) || [];
    const allTransformations = [...piiFields, ...transformationFields, ...additionalFields];

    const timestampField = () => <Box display="flex" alignItems="center">
        <Typography ml={2}>Timestamp Column - {' '}</Typography>
        <ToggleButtonGroup sx={{ mx: 1, my: 1 }} color='success' value={timestampCol}>
            <ToggleButton value={timestampCol} key={timestampCol}>{timestampCol}</ToggleButton>
        </ToggleButtonGroup>
    </Box>;

    const renderTable = () => <TableContainer>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
                <TableRow>
                    {displayColumns.map((item: any) => (
                        <TableCell key={item.id}>
                            {item.label}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {allTransformations.map((item): any => (
                    <TableRow>
                        {displayColumns.map((cellName: any) => (
                            <TableCell key={item.id}>
                                {item[cellName.id]}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}

            </TableBody>
        </Table>
    </TableContainer>;

    if (timestampCol || allTransformations.length > 0)
        return (
            <MainCard content={false} title="Data Format Configurations" sx={{ my: 2 }}>
                {timestampCol && timestampField()}
                {allTransformations.length > 0 && renderTable()}
            </MainCard >
        );
    else return (<Alert color="error" icon={<WarningOutlined />}>No information to display</Alert>);
}

export default Preview;
