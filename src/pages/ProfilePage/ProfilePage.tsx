import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import debug from 'debug';
import get from 'lodash/get';
import React, { memo } from 'react';
import { Else, If, Then } from 'react-if';
import {
  useFirestore,
  UserProfile as User,
} from 'react-redux-firebase';
import {
  handleErrors,
  useTypedTranslate,
} from '../../services/index';
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
  const t = useTypedTranslate();
  const firestore = useFirestore();

  function reset(fieldToReset: string) {
    if (props.isLoading) return;
    // eslint-disable-next-line no-restricted-globals
    if (confirm(t('are you sure')))
      firestore
        .doc('profiles/' + props.user!.uid)
        .update({
          [fieldToReset]: 0,
        })
        .catch(handleErrors);
  }
  const photoUrl = props.user!.photoURL;
  const title =
    props.user!.displayName || props.user!.email || t('anonymous');
  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="stretch"
      alignContent="center"
      className={classes.pageContainer}
    >
      <Grid item xs={12} sm={6}>
        <If condition={props.isLoading}>
          <Then>
            <Skeleton component={Box} width="100%" height="200px" />
          </Then>
          <Else>
            <Card>
              <CardHeader title={title} />
              <CardMedia component="img" src={photoUrl} />
            </Card>
          </Else>
        </If>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card>
          <List>
            <ListItem button onClick={() => reset('points')}>
              <ListItemText>
                {props.isLoading ? <Skeleton /> : t('reset points')}
              </ListItemText>
            </ListItem>
            <ListItem button onClick={() => reset('experience')}>
              <ListItemText>
                {props.isLoading ? (
                  <Skeleton />
                ) : (
                  t('reset experience')
                )}
              </ListItemText>
            </ListItem>
          </List>
        </Card>
      </Grid>
    </Grid>
  );
});

export const ProfilePageContainer = memo(
  function ProfilePageContainer(props) {
    const user = useTypedSelector(s => get(s, 'firebase.auth'));
    const profile = useTypedSelector(s => get(s, 'firebase.profile'));
    const isLoading = !(user.isLoaded && profile.isLoaded);
    log('user: %O', user);
    log('profile: %O', profile);
    log('isLoading', isLoading);
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