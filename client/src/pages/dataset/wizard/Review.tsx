import { Grid, Typography } from '@mui/material';
import ListColumns from './ListColumns';
import Loader from 'components/Loader';
import { useSelector } from 'react-redux';

export default function Review() {
  const jsonSchema = useSelector((state: any) => state.jsonSchema);
  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Review Columns
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          {jsonSchema?.status !== 'success' && <Loader />}
          {jsonSchema?.status === 'success' && <ListColumns ></ListColumns>}
          {jsonSchema?.status === 'error' && <div>Error</div>}
        </Grid>
      </Grid>
    </>
  );
}
