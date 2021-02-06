import { Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
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
import { useSelector } from 'react-redux';
import { FirebaseReducer } from 'react-redux-firebase';
import DailyTasksStreakForm from '../../components/tasks/DailyTasksStreakForm';
import DarkOrLightThemePicker from '../../components/ui/DarkOrLightThemePicker';
import ToggleEncouragingMessages from '../../components/ui/ToggleEncouragingMessages';
import { UserOverviewCard } from '../../components/users/UserOverviewCard';
import { ViewerController } from '../../controllers/ViewerController';
import { Profile } from '../../entities/Profile';
import { upsertProfile } from '../../repositories/upsertProfile';
import { handleErrors } from '../../services/index';
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
  const userId = props.user!.uid;
  const profile = useSelector(profileSelector);

  function reset(fieldToReset: 'points' | 'experience') {
    return () => {
      if (props.isLoading) return;
      // eslint-disable-next-line no-restricted-globals
      if (!confirm(t('are you sure'))) return;

      if (fieldToReset === 'points') {
        return ViewerController.resetPoints();
      }
      if (fieldToReset === 'experience') {
        return ViewerController.resetExperience();
      }
      return;
    };
  }

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
        <UserOverviewCard
          profile={profile}
          user={props.user}
          isLoading={props.isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box mb={2}>
          <DailyTasksStreakForm />
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
            <ListItem button onClick={reset('points')}>
              <ListItemText>
                {props.isLoading ? <Skeleton /> : t('reset points')}
              </ListItemText>
            </ListItem>
            <ListItem button onClick={reset('experience')}>
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
