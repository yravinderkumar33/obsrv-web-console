import { Button, CardContent, Grid, Typography } from '@mui/material';
import Avatar from 'components/@extended/Avatar';
import { AlertOutlined, BugFilled } from '@ant-design/icons';
import dayjs from 'dayjs'
import * as _ from 'lodash';
import { Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import AlertMessage from 'components/AlertMessage';
import { useEffect } from 'react';
import { fetchAlertsThunk } from 'store/middlewares';

const AlertsMessages = (props: any) => {
  const { predicate, interval } = props;
  const dispatch = useDispatch();
  const alertsState = useSelector((state: any) => state?.alerts);

  const status = _.get(alertsState, 'status') || "idle";
  const alerts = _.get(alertsState, 'data.data') || [];
  let filteredAlerts = predicate ? _.filter(alerts, predicate) : alerts;

  const filter = () => {
    const from = dayjs().subtract(interval, 'minutes');
    
  }


  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAlertsThunk({}));
    }
  }, [status]);

  const getAlert = (alert: Record<string, any>) => {
    const color: any = _.get(alert, 'labels.severity') === 'critical' ? 'error' : 'success'
    return <><Grid item xs={12}>
      <Grid container spacing={2}>
        <Grid item xs={1}>
          <Avatar type="filled" color={color} size="sm" sx={{ top: 10 }}>
            <AlertOutlined />
          </Avatar>
        </Grid>
        <Grid item xs={9}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Typography align="left" variant="caption" color="secondary">
                {dayjs(alert?.startsAt).format('DD/MM/YYYY::DD:mm:ss')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography align="left" variant="body2">
                <b>{alert?.annotations?.summary}</b>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography align="left" variant="body2">
                {alert?.annotations?.description || alert?.annotations?.message}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Stack direction="row" spacing={1}>
            <Button size='small' variant="contained">Resolve</Button>
            <Button size='small' variant="contained" color="info">Support</Button>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
    </>
  }

  const renderAlerts = () => {
    return _.map(_.orderBy(filteredAlerts, ['startsAt'], ['desc']), getAlert)
  }

  const renderNoAlertsMessage = () => {
    return <Grid item xs={12}>
      <AlertMessage color='error' messsage={"No Alerts Found"} icon={BugFilled} />
    </Grid>
  }

  return <>
    <CardContent style={{ overflow: 'auto', height: 'auto' }}>
      <Grid
        container
        spacing={2.75}
        alignItems="center"
        sx={{
          position: 'relative',
          '&>*': {
            position: 'relative',
            zIndex: '5'
          },
          '&:after': {
            content: '""',
            position: 'absolute',
            top: 10,
            left: 38,
            width: 2,
            height: '100%',
            background: '#ebebeb',
            zIndex: '1'
          }
        }}
      >
        {status !== 'success' && renderNoAlertsMessage()}
        {status === 'success' && _.get(filteredAlerts, 'length') === 0 && renderNoAlertsMessage()}
        {status === 'success' && _.get(filteredAlerts, 'length') > 0 && renderAlerts()}
      </Grid>
    </CardContent>
  </>
};

export default AlertsMessages;
