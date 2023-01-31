import {
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  Typography,
  Autocomplete,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  InputLabel,
  Tooltip
} from '@mui/material';

import { useFormik } from 'formik';
import { CloseOutlined } from '@ant-design/icons';
import IconButton from 'components/@extended/IconButton';
const validDatatypes = ['string', 'number', 'integer', 'object', 'array', 'boolean', 'null']

const EditDataset = ({ open = false, onSubmit, selection }: { open: boolean, onSubmit: () => void, selection: Record<string, any> }) => {
  const values = selection?.cell?.row?.values;
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      type: values?.type,
      isRequired: true,
      dimension: true
    },
    onSubmit: (values) => {
      console.log({ values });
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
                    {"Edit Column"}
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
                      <InputLabel>Column</InputLabel>
                      <TextField fullWidth id="outlined-basic" value={values?.column} disabled />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel>Data Type</InputLabel>
                      <Autocomplete
                        value={formik?.values?.type}
                        options={validDatatypes}
                        onChange={formik.handleChange}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel>Required</InputLabel>
                      <RadioGroup
                        row
                        value={formik?.values?.isRequired}
                        id="isRequired"
                        onChange={formik.handleChange}
                      >
                        <FormControlLabel value="true" control={<Radio />} label="True" />
                        <FormControlLabel value="false" control={<Radio />} label="False" />
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel>Dimension</InputLabel>
                      <RadioGroup
                        row
                        id="dimension"
                        value={formik?.values?.dimension}
                        onChange={formik.handleChange}
                      >
                        <FormControlLabel value="true" control={<Radio />} label="True" />
                        <FormControlLabel value="false" control={<Radio />} label="False" />
                      </RadioGroup>
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
export default EditDataset;
