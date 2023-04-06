import { BugFilled } from "@ant-design/icons"
import { Box, Grid } from "@mui/material"
import { Alert, Button } from "@mui/material"
import { Stack } from "@mui/system"
import BasicReactTable from "components/BasicReactTable"
import MainCard from "components/MainCard"
import ScrollX from "components/ScrollX"
import { useState } from "react"

const DataDenorm = (props: any) => {

    const [masterDatasetsExists, setIfMasterDatasetsExists] = useState<boolean>(true);

    const columns = [
        {
            Header: 'Dataset Field'
        },
        {
            Header: 'Master Dataset'
        },
        {
            Header: 'Master Datset Field'
        }
    ];

    const masterDatasetNotFound = () => {
        return <>
            <Grid item xs={12}>
                <Stack spacing={2} direction="column" justifyContent="center" alignItems="center">
                    <Alert color="error" icon={<BugFilled />}>
                        There are no master datasets configured in the system. Please create one to setup data denormalization for the dataset.
                    </Alert>
                    <Box><Button variant="contained">Create Master Dataset</Button></Box>
                </Stack>
            </Grid>
        </>
    }

    const renderSelectionTable = () => {
        return <>
            <MainCard content={false}>
                <ScrollX>
                    <BasicReactTable columns={columns} data={[]} striped={true} />
                </ScrollX>
            </MainCard >
        </>
    }

    const masterDatasetFound = () => {
        return <>
            <Grid item xs={12}>
                {renderSelectionTable()}
            </Grid>
            <Grid item xs={12}>
                <Stack spacing={2} direction="row">
                    <Box><Button variant="contained">Add Denorm Field</Button> </Box>
                    <Box>  <Button variant="contained">Create New Master Dataset</Button></Box>
                </Stack>
            </Grid>
        </>
    }

    return <>
        <Grid container rowSpacing={2}>
            {masterDatasetsExists ? masterDatasetFound() : masterDatasetNotFound()}
        </Grid>
    </>
}

export default DataDenorm