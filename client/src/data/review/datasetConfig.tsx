import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import MainCard from 'components/MainCard';
import { useSelector } from 'react-redux';
import * as _ from "lodash";
import DataSourcePreview from "./dataSourceConfig";
import DataFormatPreview from "./dataFormatConfig";
import FieldsPreview from "./fieldsConfig";
import ProcessingPreview from "./processingConfig";
import AdvancedPreview from "./advancedConfig";

const DatasetPreview = () => {
    const wizardState: any = useSelector((state: any) => state?.wizard);
    const datasetConfig: any = _.get(wizardState, ['pages', 'datasetConfiguration', 'state', 'config']);
    return (
        <MainCard content={false} title="Dataset Configurations">
            <TableContainer>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Dataset Name
                            </TableCell>
                            <TableCell>
                                Dataset ID
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                {datasetConfig.name}
                            </TableCell>
                            <TableCell>
                                {datasetConfig.id}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    );
}

export const sections: any = [
    {
        id: 'schemaConfig',
        title: 'Schema',
        description: 'Details about schema configuration',
        component: <DatasetPreview />,
        master: true,
        navigation: {
            next: 'inputConfig',
        }
    },
    {
        id: 'inputConfig',
        title: 'Inputs',
        description: 'Details about input configuration',
        master: true,
        component: <>
            <DataSourcePreview />
            <DataFormatPreview /></>,
        navigation: {
            next: 'fieldsConfig',
        }
    },
    {
        id: 'fieldsConfig',
        title: 'Fields',
        description: 'Details about fields configuration',
        component: <FieldsPreview />,
        navigation: {
            next: 'processingConfig',
        }
    },
    {
        id: 'processingConfig',
        title: 'Processing',
        description: 'Details about processing configuration',
        component: <ProcessingPreview />,
        navigation: {
            next: 'advancedConfig',
        }
    },
    {
        id: 'advancedConfig',
        title: 'Advanced Configuration',
        description: 'Details about advanced configuration',
        component: <AdvancedPreview />,
    },
]
