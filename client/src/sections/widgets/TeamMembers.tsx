import { CardContent, Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';

const TableWidget = () => {

  const input = {
    title: "Cluster State",
    contents: [
      {
        key: "Total Memory",
        value: "200 Gb"
      },
      {
        key: "Used Memory",
        value: "100 Gb"
      },
      {
        key: "Free Memory",
        value: "100 Gb"
      },
      {
        key: "Used Kafka",
        value: "10 Gb"
      },
      {
        key: "Used CPU",
        value: "10 Gb"
      },
      {
        key: "Used Disk",
        value: "10 Gb"
      }
    ]
  }

  return (
    <MainCard
      content={false}
    >
      <CardContent>
        <Grid container spacing={2.5} alignItems="center">
          {
            input.contents.map(payload =>
              <Grid item xs={12}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs zeroMinWidth>
                    <Typography align="left" variant="subtitle1">
                      {payload.key}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography align="left" variant="caption">
                      {payload.value}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            )
          }
        </Grid>
      </CardContent>
    </MainCard>
  )
};

export default TableWidget;
