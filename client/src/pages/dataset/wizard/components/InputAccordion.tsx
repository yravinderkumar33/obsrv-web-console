import { DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Alert, Button, Dialog, Grid, ToggleButtonGroup, ToggleButton } from "@mui/material";
import MainCard from "components/MainCard"
import BasicReactTable from "components/BasicReactTable";
import ScrollX from "components/ScrollX";
import React, { useState } from "react";
import _ from "lodash";
import IconButton from "components/@extended/IconButton";

const InputAccordion = (props: any) => {
    const { title, description, actions, data, label, dialog } = props;
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selection, setSelection] = useState<Array<any>>([]);

    const deleteSelection = (record: Record<string, any>) => {
        setSelection((preState: Array<any>) => {
            return preState.filter(payload => _.get(payload, 'column') !== _.get(record, 'column'));
        })
    }

    const columns = [
        {
            Header: 'Column Name', accessor: 'column'
        },
        {
            Header: 'Actions',
            accessor: 'age',
            Cell: ({ value, cell }: any) => {
                const row = cell?.row?.original || {};
                const _transformationType = row?._transformationType;
                return <ToggleButtonGroup value='one' exclusive aria-label="text alignment">
                    {
                        actions.map((action: any) => {
                            return <ToggleButton value="one" aria-label="first" color={_transformationType === action?.value ? 'primary' : 'secondary'}>
                                {action?.label}
                            </ToggleButton>
                        })
                    }
                </ToggleButtonGroup>
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
        return React.cloneElement(dialog, { actions, setSelection, data, onClose: () => setDialogOpen(false) });
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
        <Grid container rowSpacing={2} columnSpacing={2}>
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