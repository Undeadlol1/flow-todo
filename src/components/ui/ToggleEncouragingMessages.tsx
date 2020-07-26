import { FormControlLabel, Switch } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import { Profile } from '../../store';
import { authSelector, profileSelector } from '../../store/selectors';

const ToggleEncouragingMessages = () => {
  const profile = useSelector(profileSelector)
  const firestoreRedux = useFirestore();
  const auth = useSelector(authSelector);

  function setTheme(
    { target: { checked } }:
      React.ChangeEvent<HTMLInputElement>
  ) {
    // TODO create "update profile" reusable function
    return firestoreRedux
      .doc('profiles/' + auth.uid)
      .update({ areEcouragingMessagesDisabled: checked } as Profile);
  }

  return (
    <Card>
      <CardContent>
        <FormControl fullWidth>
          {/* TODO i18n */}
          <FormControlLabel
            disabled
            control={<Switch checked={profile.areEcouragingMessagesDisabled} onChange={setTheme} name="checkedA" />}
            label={"Мотивационные сообщения экрана с задачей"}
          />
        </FormControl>
      </CardContent>
    </Card >
  );
};

export default memo(ToggleEncouragingMessages);
