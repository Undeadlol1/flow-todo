import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import debug from 'debug';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import React, { memo } from 'react';
import { UserProfile as User } from 'react-redux-firebase';
import { Profile, useTypedSelector } from '../../store/index';

const log = debug('ProfilePage');
const useStyles = makeStyles(theme => ({
  pageContainer: {
    marginTop: 0,
    marginBottom: 0,
    minHeight: 'calc(100vh - 74px)',
  },
}));

interface Props {
  user?: User;
  profile?: Profile;
  isLoading: boolean;
}

export const ProfilePage = memo(function ProfilePage(props: Props) {
  const classes = useStyles();
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
        <Card>
          <CardHeader title={props.user!.uid} />
        </Card>
      </Grid>
    </Grid>
  );
});

export const ProfilePageContainer = memo(
  function ProfilePageContainer(props) {
    const user = useTypedSelector(s => get(s, 'firebase.auth'));
    const profile = useTypedSelector(s => get(s, 'firebase.profile'));
    log('user: ', user);
    log('profile: ', profile);
    const isLoading = isUndefined(user) || isUndefined(profile);
    return (
      <ProfilePage
        {...{
          isLoading,
          user,
          profile,
        }}
      />
    );
  },
);
