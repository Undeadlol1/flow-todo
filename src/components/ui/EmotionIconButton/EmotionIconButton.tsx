import { Fab } from '@material-ui/core';
import React, { memo } from 'react';
import { Icon } from '../../ui/Icon';

export interface EmotionIconButtonProps {
  type: 'happy_face' | 'sad_face';
  onClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}

const EmotionIconButton = memo(function EmotionIconButton(
  props: EmotionIconButtonProps,
) {
  return (
    <Fab color="secondary" onClick={props.onClick}>
      <Icon code={props.type} size="large" />
    </Fab>
  );
});

EmotionIconButton.displayName = 'EmotionIconButton';

export { EmotionIconButton };
