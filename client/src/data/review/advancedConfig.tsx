import { Box, ToggleButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ToggleButtonGroup, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { useSelector } from 'react-redux';
import * as _ from "lodash";

const Preview = () => {
    const wizardState: any = useSelector((state: any) => state?.wizard);
    const dataValidation: any = _.get(wizardState, ['pages', 'dataRention', 'values']);
    const rollupConfig: any = _.get(wizardState, ['pages', 'rollup', 'values']);
    return (
        <>
            <MainCard content={false} title="Data Retention Config" sx={{ my: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                {Object.keys(dataValidation).map((item: any) => (
                                    <TableCell key={item}>
                                        {item}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                {Object.values(dataValidation).map((item: any) => (
                                    <TableCell key={item}>
                                        {`${item}`}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard >
            <MainCard content={false} title="Rollup Config" sx={{ my: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                {rollupConfig.map((item: any) => (
                                    Object.keys(item).map((keyName: any) => (
                                        <TableCell key={keyName}>
                                            {_.capitalize(keyName)}
                                        </TableCell>
                                    ))))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rollupConfig.map((item: any) => (
                                <TableRow>
                                    {Object.values(item).map((keyName: any) => (
                                        <TableCell key={keyName}>
                                            {_.capitalize(keyName)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard >
        </>
    );
}

export default Preview;
