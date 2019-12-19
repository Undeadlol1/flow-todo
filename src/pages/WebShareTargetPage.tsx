import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React, { memo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  pageContainer: {
    marginTop: 0,
    marginBottom: 0,
    minHeight: 'calc(100vh - 74px)',
  },
}));

interface Props {}

const WebShareTargetPage = memo((props: Props) => {
  const classes = useStyles();
  const params: any = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  return (
    <Grid
      container
      spacing={2}
      justify="center"
      direction="column"
      alignItems="stretch"
      alignContent="center"
      className={classes.pageContainer}
    >
      <Grid item xs={12} sm={8} md={8} lg={6}>
        <Typography variant="h2" gutterBottom>
          params: {JSON.stringify(params)}
        </Typography>
        <Typography variant="h4">
          query title: {JSON.stringify(query.get('title'))}
        </Typography>
        <Typography variant="h4">
          query text: {JSON.stringify(query.get('text'))}
        </Typography>
        <Typography variant="h4">
          query url: {JSON.stringify(query.get('url'))}
        </Typography>
      </Grid>
    </Grid>
  );
});

export default WebShareTargetPage;
