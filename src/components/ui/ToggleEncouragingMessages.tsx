import { FormControlLabel, Switch } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import React, { memo } from 'react';
import { useTypedTranslate } from '../../services';

interface Props {
  value: boolean;
  isLoading?: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleEncouragingMessages = memo((props: Props) => {
  const t = useTypedTranslate();
  return (
    <Card>
      <CardContent>
        <FormControl fullWidth>
          <FormControlLabel
            control={
              <Switch
                name="checkedA"
                checked={!props.value}
                disabled={props.isLoading}
                onChange={(e) => props.onChange(!e.target.checked)}
              />
            }
            label={t('motivational_messages_of_task_page')}
          />
        </FormControl>
      </CardContent>
    </Card>
  );
});

export default ToggleEncouragingMessages;
