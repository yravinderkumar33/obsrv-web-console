import * as _ from 'lodash';
import { Tabs, Tab, Box, Grid } from '@mui/material';
import { metricsMetadata } from 'data/metrics';
import { useState } from 'react';
import MetricsDetails from './details';
import ClusterStatus from 'sections/widgets/Cluster';

function Panel(props: any) {
    const { children, value, index, id, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`metrics-tabpanel-${index}`} aria-labelledby={`metrics-tab-${index}`} {...other}>
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const MetricsPanel = () => {
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <ClusterStatus />
                </Grid>
                <Grid item xs={12} id="tabSectionStart">
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="metrics tabs">
                                {metricsMetadata.map((metric, index) => {
                                    const { menuIcon, id, primaryLabel } = metric;
                                    const MenuIcon = menuIcon
                                    return <Tab label={primaryLabel} id={id} icon={<MenuIcon />} iconPosition="start" aria-controls={`metrics-tabpanel-${index}`} key={index} />
                                })}
                            </Tabs>
                        </Box>
                        {metricsMetadata.map((metric, index) => {
                            const { id } = metric;
                            return <Panel value={value} index={index} id={id} key={index}>
                                <MetricsDetails id={id} showClusterPanel={true}></ MetricsDetails>
                            </Panel>
                        })}
                    </Box>
                </Grid>

            </Grid>
        </>
    )
};

export default MetricsPanel;
