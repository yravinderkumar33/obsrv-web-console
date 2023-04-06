import { Breadcrumbs as MuiBreadcrumbs, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, connect } from 'react-redux';
import { addState, updateState } from 'store/reducers/wizard';
import { useEffect, useState } from 'react';
import { error } from 'services/toaster';

const WizardBreadcrumbs = ({ datasetConfiguration }: any) => {
    const dispatch = useDispatch();
    const [datasetName, setDatasetName] = useState('');
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        setDatasetName(datasetConfiguration?.config?.id);
    }, [datasetConfiguration?.config?.id]);

    const handleClick = () => {
        setEdit((prevState) => !prevState);
    }

    const handleEditId = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value !== '' && e.target.value.length >= 4) {
            setDatasetName(e.target.value);
            if (datasetConfiguration) {
                dispatch(addState({
                    id: 'datasetConfiguration', state: {
                        ...datasetConfiguration,
                        config: {
                            name: e.target.value,
                            id: e.target.value,
                        }
                    }
                }));
            }
            else {
                dispatch(addState({
                    id: 'datasetConfiguration', state: {
                        config: {
                            name: e.target.value,
                            id: e.target.value,
                        }
                    }
                }));
            }
        } else {
            dispatch(error({ message: "Dataset ID cannot have less than 4 characters" }))
        }
    }

    return (
        <MuiBreadcrumbs aria-label="breadcrumb">
            <Typography component={Link} to="/" color="textSecondary" variant="h6" sx={{ textDecoration: 'none' }}>
                {'Home'}
            </Typography>
            {!edit && <Typography onClick={handleClick} color="text.primary">{datasetName || "New Dataset"}</Typography>}
            {edit &&
                <TextField
                    name="id"
                    label="Edit dataset id"
                    value={datasetName}
                    autoFocus
                    InputProps={{
                        sx: { "&.MuiInputBase-root": { marginBottom: 2 } }
                    }}
                    onBlur={handleClick}
                    onChange={handleEditId}
                    required
                    variant='standard'
                />
            }
        </MuiBreadcrumbs>
    );
}

const mapStateToProps = (state: any) => {
    const datasetConfiguration = state?.wizard?.pages?.datasetConfiguration?.state;
    return { datasetConfiguration }
}

export default connect(mapStateToProps, {})(WizardBreadcrumbs);
