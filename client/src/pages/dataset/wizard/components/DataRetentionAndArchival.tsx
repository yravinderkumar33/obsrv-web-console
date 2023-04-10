import { InfoCircleOutlined } from "@ant-design/icons";
import { Radio } from "@mui/material";
import { Stack } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Alert, Checkbox, FormControl, FormControlLabel, Grid, RadioGroup, TextField, Tooltip } from "@mui/material";
import config from 'data/initialConfig';
import { useFormik } from "formik";
const { spacing } = config;


const DataRetentionAndArchival = (props: any) => {
    const { description } = props;

    const formik = useFormik({ initialValues: {}, onSubmit: values => console.log(values) });
    const formValues = formik.values;

    const renderArchivalForm = () => {
        return <Stack spacing={1}>
            <InputLabel htmlFor="email">Archival Policy</InputLabel>
            <FormControl component="fieldset">
                <RadioGroup aria-label="gender" defaultValue="coldStorage" name="archivalPolicy" row onChange={formik.handleChange}>
                    <FormControlLabel value="purge" control={<Radio />} label="Purge Data" />
                    <FormControlLabel value="coldStorage" control={<Radio />} label="Move to Cold Storage" />
                </RadioGroup>
            </FormControl>
        </Stack>

    }

    const renderRetentionForm = () => {
        const name = "configureRetention"
        return <Stack spacing={1}>
            <InputLabel htmlFor="email">Retention Policy</InputLabel>
            <Grid container rowSpacing={spacing} justifyContent="flex-start" alignItems="center">
                <Grid item xs={3}>
                    <FormControlLabel key={`${name}`} name={name} control={<Checkbox name={'configureRetention'} className="size-medium" onChange={formik.handleChange} />} label={'Configure Retention Period'} />
                </Grid>
                <Grid item xs={3}>
                    <Tooltip title={'Configure Retention Period in Days'}><TextField label="Duration in Days" onChange={formik.handleChange} type="number" name="retentionPeriod" variant="outlined" fullWidth autoComplete="off" /></Tooltip>
                </Grid>
            </Grid>
        </Stack>
    }

    return <>
        <Grid container rowSpacing={2}>
            {description && <Grid item xs={12}> <Alert color="info" icon={<InfoCircleOutlined />}> {description}</Alert></Grid>}
            <Grid item xs={12} >
                <form onSubmit={formik.handleSubmit}>
                    {renderRetentionForm()}
                    {renderArchivalForm()}
                </form>
            </Grid>
        </Grid>
    </>
}

export default DataRetentionAndArchival;