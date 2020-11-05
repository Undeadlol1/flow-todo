import { Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/styles';
import debug from 'debug';
import firebase from 'firebase/app';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Else, If, Then } from 'react-if';
import { useSelector } from 'react-redux';
import { FirebaseReducer, useFirestore } from 'react-redux-firebase';
import DayliTasksStreakForm from '../../components/tasks/DayliTasksStreakForm';
import DarkOrLightThemePicker from '../../components/ui/DarkOrLightThemePicker';
import ToggleEncouragingMessages from '../../components/ui/ToggleEncouragingMessages';
import { MyUserPoints } from '../../components/unsorted/MyUserPoints';
import { handleErrors } from '../../services/index';
import LevelingService from '../../services/leveling';
import { Profile } from '../../entities/Profile';
import { upsertProfile } from '../../repositories/upsertProfile';
import { authSelector, profileSelector } from '../../store/selectors';

const log = debug('ProfilePage');

const useStyles = makeStyles((theme: Theme) => ({
  pageContainer: {
    marginTop: 0,
    marginBottom: 0,
    minHeight: 'calc(100vh - 74px)',
  },
}));

interface Props {
  profile?: Profile;
  isLoading: boolean;
  user?: firebase.UserInfo & FirebaseReducer.AuthState;
}

export const ProfilePage = memo((props: Props) => {
  const classes = useStyles();
  const [t] = useTranslation();
  const firestore = useFirestore();
  const userId = props.user!.uid;
  const profile = useSelector(profileSelector);

  function reset(fieldToReset: string) {
    if (props.isLoading) return;
    // eslint-disable-next-line no-restricted-globals
    if (confirm(t('are you sure'))) {
      firestore
        .doc(`profiles/${userId}`)
        .update({
          [fieldToReset]: 0,
        })
        .catch(handleErrors);
    }
  }
  const photoUrl = props.user!.photoURL;
  const title =
    props.user!.displayName || props.user!.email || t('anonymous');
  // TODO get rid of + 1
  const userLevel =
    LevelingService.calculateUserLevel(profile.experience) + 1;

  function updateProfile(profile: Profile) {
    profile.userId = userId;
    log('updateProfile called.', profile);
    return upsertProfile(profile).catch(handleErrors);
  }

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
              <CardHeader
                title={title}
                subheader={
                  <>
                    <Grid container justify="space-between">
                      <Grid item xs={6}>
                        {t('level_is', { level: userLevel })}{' '}
                      </Grid>
                      <Grid item xs={6}>
                        <Box textAlign="right">
                          {t('points')}: <MyUserPoints />
                        </Box>
                      </Grid>
                    </Grid>
                  </>
                }
              />
              <CardMedia component="img" src={photoUrl as string} />
            </Card>
          </Else>
        </If>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box mb={2}>
          <DayliTasksStreakForm />
        </Box>
        <Box mb={2}>
          <DarkOrLightThemePicker />
        </Box>
        <Box mb={2}>
          <ToggleEncouragingMessages
            isLoading={props.isLoading}
            value={profile.areEcouragingMessagesDisabled}
            onChange={(areEcouragingMessagesDisabled) =>
              updateProfile({
                ...profile,
                areEcouragingMessagesDisabled,
              })
            }
          />
        </Box>
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

export const ProfilePageContainer = memo((props) => {
  const user = useSelector(authSelector);
  const profile = useSelector(profileSelector);
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
});
