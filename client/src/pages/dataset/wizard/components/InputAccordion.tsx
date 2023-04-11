import { DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Alert, Button, Dialog, Grid, ToggleButtonGroup, ToggleButton, Typography, Tooltip } from "@mui/material";
import MainCard from "components/MainCard"
import BasicReactTable from "components/BasicReactTable";
import ScrollX from "components/ScrollX";
import React, { useEffect, useState } from "react";
import _ from "lodash";
import IconButton from "components/@extended/IconButton";
import config from 'data/initialConfig';
import { ButtonGroup } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { deleteTransformations } from "services/dataset";
import { error } from "services/toaster";
import { addState } from "store/reducers/wizard";
const { spacing } = config;

const InputAccordion = (props: any) => {
    const dispatch = useDispatch();
    const { id, title, description, actions, data, label, dialog } = props;
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selection, setSelection] = useState<Array<any>>([]);
    const existingState = useSelector((state: any) => _.get(state, ['wizard', 'pages', id, 'selection']));
    const configState = useSelector((state: any) => _.get(state, ['wizard', 'pages', 'datasetConfiguration', 'state', 'config']));
    const pushStateToStore = (values: Record<string, any>) => dispatch(addState({ id, ...values }));

    const deleteSelection = async (record: Record<string, any>) => {
        const data = await deleteTransformations(record.id);
        if (data.data)
            setSelection((preState: Array<any>) => {
                const data = preState.filter(payload => _.get(payload, 'column') !== _.get(record, 'column'));
                pushStateToStore(data);
                return data;
            })
        else dispatch(error({ message: "Unable to delete the config item" }));

    }

    useEffect(() => {
        existingState && setSelection(existingState);
    }, [existingState])

    const renderExpression = (row: Record<string, any>) => {
        const transformation = row?.transformation;
        if (!transformation) return null;
        return <Typography variant="body1" gutterBottom>
            {transformation}
        </Typography>
    }

    const columns = [
        {
            Header: 'Column Name', accessor: 'column'
        },
        {
            Header: 'Transformation',
            accessor: 'age',
            Cell: ({ value, cell }: any) => {
                const row = cell?.row?.original || {};
                const _transformationType = row?._transformationType;
                if (_.get(actions, 'length') < 2 && _transformationType === 'custom') return renderExpression(row);
                return <ButtonGroup variant="outlined" aria-label="outlined button group">
                    {
                        actions.map((action: any) => {
                            return <Button key="one" variant={_transformationType === action?.value ? 'contained' : 'outlined'}>{action?.label}</Button>
                        })
                    }
                </ButtonGroup>
            }
        },
        {
            Header: 'Delete',
            Cell: ({ value, cell }: any) => {
                return <IconButton variant="contained" onClick={(e: any) => deleteSelection(_.get(cell, 'row.original'))}>
                    <DeleteOutlined />
                </IconButton>
            }
        }
    ]

    const updateDialogProps = () => {
        return React.cloneElement(dialog, { id, actions, selection, setSelection, data, onClose: () => setDialogOpen(false), configState, });
    }

    const renderTable = () => {
        if (!_.get(selection, 'length')) return null;
        return <Grid item xs={12}>
            <MainCard content={false}>
                <ScrollX>
                    <BasicReactTable columns={columns} data={selection} striped={true} />
                </ScrollX>
            </MainCard >
        </Grid>
    }

    return <>
        <Grid container rowSpacing={spacing} columnSpacing={spacing}>
            <Grid item xs={12}> <Alert color="info" icon={<InfoCircleOutlined />}> {description}</Alert></Grid>
            {renderTable()}
            <Grid item xs={12}>
                <Button variant="contained" onClick={_ => setDialogOpen(true)} >{label}</Button>
            </Grid>
            <Grid item xs={12}>
                <Dialog open={dialogOpen} onClose={_ => setDialogOpen(false)} aria-labelledby={title} aria-describedby={title}>
                    {updateDialogProps()}
                </Dialog>
            </Grid>
        </Grid>
    </>
}

export default InputAccordion
