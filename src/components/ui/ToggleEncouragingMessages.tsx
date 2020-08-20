import { FormControlLabel, Switch } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import { Profile } from '../../store';
import { authSelector, profileSelector } from '../../store/selectors';
import { upsertProfile } from '../../store/index';

const ToggleEncouragingMessages = memo(() => {
  const profile = useSelector(profileSelector);
  const firestoreRedux = useFirestore();
  const auth = useSelector(authSelector);

  function updateProfile({
    target: { checked },
  }: React.ChangeEvent<HTMLInputElement>) {
    const payload = {
      areEcouragingMessagesDisabled: checked,
    } as Profile;
    console.log('payload: ', payload);
    console.log('auth.uid: ', auth.uid);
    // return upsertProfile(auth.uid, payload);
  }

  return (
    <Card>
      <CardContent>
        <FormControl fullWidth>
          {/* TODO i18n */}
          <FormControlLabel
            control={
              <Switch
                disabled
                // TODO
                name="checkedA"
                onChange={updateProfile}
                checked={profile.areEcouragingMessagesDisabled}
              />
            }
            label={'Мотивационные сообщения экрана с задачей'}
          />
        </FormControl>
      </CardContent>
    </Card>
  );
});

export default ToggleEncouragingMessages;
