import * as _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { publishDataset } from 'services/dataset';
import { error } from 'services/toaster';
import { fetchDatasetsThunk } from 'store/middlewares';
import { useNavigate } from 'react-router';

const Final = () => {
  const wizardState: any = useSelector((state: any) => state?.wizard);
  const jsonSchema: any = useSelector((state: any) => state?.jsonSchema);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const publish = async () => {
    if (jsonSchema?.status === 'success') {
      const originalSchema = jsonSchema?.data;
      try {
        await publishDataset(originalSchema, wizardState);
        dispatch(fetchDatasetsThunk({}));
        navigate('/datasets');
      } catch (err) {
        dispatch(error({ message: 'Something went wrong. Please try again later.' }));
      }
    }
  }

  return (
    <>
      <Button variant="contained" onClick={publish}>Publish</Button>
    </>
  );
};

export default Final;
