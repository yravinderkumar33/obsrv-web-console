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
  MenuItem,
  AlertTitle
} from '@mui/material';

import { useFormik } from 'formik';
import { CloseOutlined, WarningFilled } from '@ant-design/icons';
import IconButton from 'components/@extended/IconButton';
import _ from 'lodash';
import { Select } from '@mui/material';
import { Alert } from '@mui/material';
import { useSelector } from 'react-redux';

const validDatatypes = ['string', 'number', 'integer', 'object', 'array', 'boolean', 'null'];

const EditDataset = ({ open = false, onSubmit, selection, setData }: { open: boolean, setData: any, onSubmit: () => void, selection: Record<string, any> }) => {
  const values = selection?.cell?.row?.original;
  const globalConfig = useSelector((state: any) => state?.config);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      type: values?.type
    },
    onSubmit: (formValues) => {
      const updatedValues = { ...values, ...formValues };
      const hasConflicts = _.get(values, 'suggestions.length');
      setData((preState: Array<Record<string, any>>) => {
        return _.map(preState, state => {
          if (_.get(state, 'column') === _.get(updatedValues, 'column')) {
            return { ...state, ...updatedValues, isModified: true, value: formValues, ...(hasConflicts && { resolved: true }) };
          } else {
            return state
          }
        });
      });
      onSubmit();
    }
  });

  const fetchSuggestions = () => {
    const { suggestions = [] } = values;
    const { severityToColorMapping } = globalConfig;
    return suggestions.map((suggestion: any, index: number) => {
      const color = _.get(severityToColorMapping, [suggestion?.severity || "LOW", "color"])
      const icon = WarningFilled
      return <Alert color={color} variant="border" icon={<WarningFilled />}>
        <AlertTitle>{suggestion?.message}</AlertTitle>
        <Typography variant="h6"> {suggestion?.advice}</Typography>
      </Alert>
    })
  }

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
                  <Stack spacing={1} >
                    {fetchSuggestions()}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <InputLabel>Data Type</InputLabel>
                      <Select
                        fullWidth
                        id="type"
                        value={formik?.values?.type}
                        label="Type"
                        name='type'
                        onChange={formik.handleChange}
                        onSelect={formik.handleChange}
                      >
                        {values?.oneof && values.oneof.map((dataType: { type: string }, index: number) => <MenuItem key={index} value={dataType.type}>{dataType.type.toUpperCase()}</MenuItem>)}
                        {!values?.oneof && validDatatypes.map((dataType, index) => <MenuItem key={index} value={dataType}>{dataType.toUpperCase()}</MenuItem>)}
                      </Select>
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
