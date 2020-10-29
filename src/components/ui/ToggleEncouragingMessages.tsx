import { FormControlLabel, Switch } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import React, { memo } from 'react';

interface Props {
  value: boolean;
  isLoading?: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleEncouragingMessages = memo((props: Props) => (
  <Card>
    <CardContent>
      <FormControl fullWidth>
        {/* TODO i18n */}
        <FormControlLabel
          control={(
            <Switch
                // TODO
              name="checkedA"
              disabled={props.isLoading}
              checked={!props.value}
              onChange={e => props.onChange(!e.target.checked)}
            />
            )}
            // TODO i18n
          label="Мотивационные сообщения экрана с задачей"
        />
      </FormControl>
    </CardContent>
  </Card>
  ));

export default ToggleEncouragingMessages;
