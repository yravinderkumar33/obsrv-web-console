import { DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons"
import { Box, FormControl, FormHelperText, Grid, MenuItem, Select, TextField } from "@mui/material"
import { Alert, Button } from "@mui/material"
import { Stack } from "@mui/system"
import BasicReactTable from "components/BasicReactTable"
import MainCard from "components/MainCard"
import ScrollX from "components/ScrollX"
import { useEffect, useState } from "react"
import config from 'data/initialConfig';
import { Dialog } from "@mui/material"
import IconButton from "components/@extended/IconButton";
import * as _ from 'lodash';
import initialConfig from 'data/initialConfig'
import AddRollup from "./transformationDialogs/AddRollup"
import { useDispatch } from "react-redux"
import { updateState } from "store/reducers/wizard"

const { spacing } = config;

const RollupConfiguration = (props: any) => {
    const dispatch = useDispatch();
    const { description, pageId, index } = props;
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [selection, setSelection] = useState<Array<any>>([]);
    const pushStateToStore = (values?: any) => {
        dispatch(updateState({ id: pageId, index: index, state: { rollupConfig: [...selection] } }));
    }

    const deleteSelection = (metadata: Record<string, any>) => {
        setSelection((preState: Array<any>) => {
            return preState.filter(payload => _.get(payload, 'datasetField') !== _.get(metadata, 'datasetField'));
        })
    }

    useEffect(() => {
        pushStateToStore();
    }, [selection]);

    const columns = [
        {
            Header: 'Field',
            accessor: 'field'
        },
        {
            Header: 'Aggregate Function',
            accessor: 'aggregateFunction'
        },
        {
            Header: 'Rollup Field Name',
            accessor: 'rollupFieldName'
        },
        {
            Header: 'Actions',
            Cell: ({ value, cell }: any) => {
                return <IconButton variant="contained" onClick={(e: any) => deleteSelection(_.get(cell, 'row.original'))}>
                    <DeleteOutlined />
                </IconButton>
            }
        }
    ];

    const renderRollupGranulatiry = () => {
        const rollupGranularities = initialConfig.rollupGranularityTypes;
        const rollupOptions = _.map(rollupGranularities, rollupGranularity => {
            return <MenuItem value={rollupGranularity}>{_.upperCase(rollupGranularity)} </MenuItem>;
        })

        return <>
            <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                    <FormControl>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <FormHelperText>Rollup Granularity</FormHelperText>
                            <Select value={'day'} sx={{ minWidth: '200px' }}>
                                {rollupOptions}
                            </Select>
                        </Stack>
                    </FormControl>
                    <FormControl>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <FormHelperText>Rollup Granularity</FormHelperText>
                            <TextField id="outlined-basic" disabled value={'datasetid_rollup_hourly'} />
                        </Stack>
                    </FormControl>
                </Stack>

            </Grid>
        </>
    }

    const renderSelectionTable = () => {
        return <>
            <MainCard content={false}>
                <ScrollX>
                    <BasicReactTable columns={columns} data={selection} striped={true} />
                </ScrollX>
            </MainCard >
        </>
    }

    const renderRollupConfigTable = () => {
        return <>
            <Grid item xs={12}> {_.get(selection, 'length') ? renderSelectionTable() : null}</Grid>
            <Grid item xs={12}>
                <Stack spacing={spacing} direction="row">
                    <Box><Button variant="contained" onClick={_ => setDialogOpen(true)}>Add New Rollup</Button> </Box>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Dialog open={dialogOpen} onClose={_ => setDialogOpen(false)}>
                    <AddRollup setSelection={setSelection} onClose={() => setDialogOpen(false)}></AddRollup>
                </Dialog>
            </Grid >
        </>
    }

    return <>
        <Grid container rowSpacing={2}>
            {description && <Grid item xs={12}> <Alert color="info" icon={<InfoCircleOutlined />}> {description}</Alert></Grid>}
            {renderRollupGranulatiry()}
            {renderRollupConfigTable()}
        </Grid>
    </>
}

export default RollupConfiguration
