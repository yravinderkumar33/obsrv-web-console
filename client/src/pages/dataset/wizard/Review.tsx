import { Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ListDatasets from './ListDatasets';
import { fetchJsonSchemaThunk } from 'store/middlewares';
import Loader from 'components/Loader';

export default function Review() {

  const jsonSchema = useSelector((state: any) => state.jsonSchema)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchJsonSchemaThunk({}))
  }, [])

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Review Columns
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          {jsonSchema?.status !== 'success' && <Loader />}
          {jsonSchema?.status === 'success' && <ListDatasets data={jsonSchema?.data}></ListDatasets>}
        </Grid>
      </Grid>
    </>
  );
}
