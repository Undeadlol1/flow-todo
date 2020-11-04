import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import nanoid from 'nanoid';
import React, { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import not from 'ramda/es/not';
import queryString from 'query-string';
import { Theme } from '@material-ui/core';
import { authSelector } from '../store/selectors';
import { createTask } from "../repositories/createTask";

const useStyles = makeStyles((theme: Theme) => ({
  pageContainer: {
    marginTop: 0,
    marginBottom: 0,
    minHeight: 'calc(100vh - 74px)',
  },
}));

const WebShareTargetPage = memo(() => {
  const classes = useStyles();
  const history = useHistory();
  const auth = useSelector(authSelector);
  const query = queryString.parse(useLocation().search);
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    const id = nanoid();
    const { note, url } = query;
    const name = (query.name || note || url) as string;

    if (auth.uid && name && !inProgress) {
      setInProgress(not);
      createTask({
        id,
        name,
        userId: auth.uid,
        note: (url || note) as string,
      }).then(() => history.push(`/tasks/${id}`));
    }
  }, [auth, inProgress, history, query]);

  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="stretch"
      alignContent="center"
      className={classes.pageContainer}
    >
      <Grid item xs={12} sm={8} md={8} lg={6}>
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      </Grid>
    </Grid>
  );
});

export default WebShareTargetPage;
