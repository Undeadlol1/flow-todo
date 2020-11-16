import { Fab } from '@material-ui/core';
import React, { memo } from 'react';
import { Icon } from '../../ui/Icon';

export interface EmotionIconButtonProps {
  type: 'happy_face' | 'sad_face';
}

const EmotionIconButton = memo(function EmotionIconButton(
  props: EmotionIconButtonProps,
) {
  return (
    <Fab color="secondary">
      <Icon code={props.type} size="large" />
    </Fab>
  );
});

EmotionIconButton.displayName = 'EmotionIconButton';

export { EmotionIconButton };
