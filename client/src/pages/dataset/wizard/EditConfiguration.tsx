import {
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  Typography,
  Stack,
  TextField,
  InputLabel,
  Tooltip,
} from '@mui/material';

import { useFormik } from 'formik';
import { CloseOutlined } from '@ant-design/icons';
import IconButton from 'components/@extended/IconButton';
import _ from 'lodash';

const EditConfiguration = ({ open = false, onSubmit, selection, setData }: { open: boolean, setData: any, onSubmit: () => void, selection: Record<string, any> }) => {
  const values = selection?.cell?.row?.values;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      key: values?.key,
      value: values?.value
    },
    onSubmit: (formValues) => {
      const updatedValues = { ...values, ...formValues }
      setData((preState: Array<Record<string, any>>) => {
        return _.map(preState, state => {
          if (_.get(state, 'key') === _.get(updatedValues, 'key')) {
            return { ...state, ...updatedValues, isModified: true };
          } else {
            return state
          }
        });
      });
      onSubmit();
    }
  });

  return (
    <Drawer
      sx={{
        ml: open ? 3 : 0,
        flexShrink: 0,
        zIndex: 1200,
        overflowX: 'hidden',
        width: { xs: 320, md: 450 },
        '& .MuiDrawer-paper': {
          height: '100vh',
          width: { xs: 320, md: 450 },
          position: 'fixed',
          border: 'none',
          borderRadius: '0px'
        }
      }}
      variant="temporary"
      anchor="right"
      open={open}
      ModalProps={{ keepMounted: true }}
      onClose={() => {
        formik.resetForm();
      }}
    >
      {open && (
        <>
          <Box sx={{ p: 3 }}>
            <Grid container alignItems="center" spacing={0.5} justifyContent="space-between">
              <Grid item sx={{ width: 'calc(100% - 64px)' }}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography
                    variant="h4"
                    sx={{
                      display: 'inline-block',
                      width: 'calc(100% - 34px)',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      verticalAlign: 'middle'
                    }}
                  >
                    {"Edit Configuration Value"}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item>
                <Stack direction="row" alignItems="center">
                  <Tooltip title="Close">
                    <IconButton color="secondary" size="small" sx={{ fontSize: '0.875rem' }} onClick={onSubmit}>
                      <CloseOutlined />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Grid>
            </Grid>
          </Box>
          <Divider />
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <InputLabel>Key</InputLabel>
                      <TextField fullWidth id='key' name='key' value={formik.values.key} disabled />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel>Value</InputLabel>
                      <TextField fullWidth id='value' value={formik.values.value} onChange={formik.handleChange} onInput={formik.handleChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            <Divider />
            <Box sx={{ p: 3 }}>
              <Grid container >
                <Grid item>
                  <Stack direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={2} >
                    <Button color="error" size="small" onClick={onSubmit}>
                      Cancel
                    </Button>
                    <Button variant="contained" size="small" type='submit'>
                      Submit
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </form>
        </>
      )}
    </Drawer>
  );
};
export default EditConfiguration;
