import { Box, ToggleButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ToggleButtonGroup, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { useSelector } from 'react-redux';
import * as _ from "lodash";

const displayColumns = [
    { id: 'column', label: 'Column' },
    { id: 'transformation', label: 'Transform Expression' },
    { id: '_transformationType', label: 'Transformation Type' },
];

const Preview = () => {
    const wizardState: any = useSelector((state: any) => state?.wizard);
    const timestampCol: any = _.get(wizardState, ['pages', 'timestamp', 'indexCol']);
    const piiFields: any = _.get(wizardState, ['pages', 'pii', 'selection']);
    const transformationFields: any = _.get(wizardState, ['pages', 'transformation', 'selection']);
    const additionalFields: any = _.get(wizardState, ['pages', 'additionalFields', 'selection']);
    const allTransformations = [...piiFields, ...transformationFields, ...additionalFields];
    return (
        <MainCard content={false} title="Data Format Configurations" sx={{ my: 2 }}>
            <Box display="flex" alignItems="center">
                <Typography ml={2}>Timestamp Column - {' '}</Typography>
                <ToggleButtonGroup sx={{ mx: 1, my: 1 }} color='success' value={timestampCol}>
                    <ToggleButton value={timestampCol} key={timestampCol}>{timestampCol}</ToggleButton>
                </ToggleButtonGroup>
            </Box>
            <TableContainer>
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
            </TableContainer>
        </MainCard >
    );
}

export default Preview;
