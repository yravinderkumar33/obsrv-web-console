import { Button, CardContent, Grid, Typography } from '@mui/material';
import Avatar from 'components/@extended/Avatar';
import { AlertOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'
import { useEffect, useState } from 'react';
import { fetchChartData } from 'services/clusterMetrics';
import chartMeta from 'data/charts'
import * as _ from 'lodash';
import { Stack } from '@mui/material';

const AlertsMessages = (props: any) => {
  const { interval } = props;
  const [alerts, setAlerts] = useState<Record<string, any>>([]);

  const calcInterval = (minutes: number) => {
    return [dayjs().subtract(minutes, 'minutes'), dayjs()]
  }

  const fetchAlerts = async () => {
    const { query } = chartMeta.alerts;
    if (interval) {
      const [startsAt, endsAt] = calcInterval(interval);
      query.params = {
        ...query.params,
        startsAt, endsAt
      }
    }
    const alerts = await fetchChartData(query);
    setAlerts(alerts);
  }

  useEffect(() => {
    fetchAlerts();
  }, [interval])

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
                {alert?.annotations?.description}
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

  return <>
    <CardContent>
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
        {
          _.map(_.orderBy(alerts, ['startsAt'], ['desc']), getAlert)
        }
      </Grid>
    </CardContent>
  </>
};

export default AlertsMessages;
