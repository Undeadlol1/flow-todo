import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  Grid,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import firebase from 'firebase/app';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Else, If, Then } from 'react-if';
import { FirebaseReducer } from 'react-redux-firebase';
import { Profile } from '../../entities/Profile';
import LevelingService from '../../services/Leveling';
import { MyUserPoints } from './MyUserPoints';

export function UserOverviewCard({
  user,
  ...props
}: {
  profile: Profile;
  isLoading: boolean;
  user?: firebase.UserInfo & FirebaseReducer.AuthState;
}) {
  const { t } = useTranslation();
  const photoUrl = user!.photoURL;
  const title = user!.displayName || user!.email || t('anonymous');
  // TODO get rid of + 1
  const userLevel =
    LevelingService.calculateUserLevel(props.profile.experience) + 1;
  return (
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
                    {t('level_is', {
                      level: userLevel,
                    })}{' '}
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
  );
}
