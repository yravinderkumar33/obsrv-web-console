import * as _ from 'lodash';
import { Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import { getAllSettings, transformSystemSettingsResponse } from 'services/systemSettings';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSystemSettings } from 'store/reducers/systemSettings';
import AccordionSection from 'components/AccordionSection';
import SystemSetting from './components/SystemSetting';

const getSectionsConfig = (payload: Record<string, any>) => {
    const keys = _.keys(payload);
    return _.map(keys, key => ({
        id: key,
        title: key,
        component: <SystemSetting></ SystemSetting>
    }))
}

const SystemSettings = () => {
    const dispatch = useDispatch();
    const settings = useSelector((state: any) => _.get(state, 'systemSettings'));
    const formattedSettingsPayload = transformSystemSettingsResponse(settings);
    const sections = getSectionsConfig(formattedSettingsPayload);

    const allSettings = async () => {
        const settings = await getAllSettings({});
        dispatch(addSystemSettings(settings));
    }

    useEffect(() => {
        allSettings();
    }, []);

    return (
        <>
            <MainCard title="System Settings">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <AccordionSection sections={sections}></AccordionSection>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    )
};

export default SystemSettings;
