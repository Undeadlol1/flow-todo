import { Fab } from '@material-ui/core';
import React, { memo } from 'react';
import { Icon } from '../../ui/Icon';

export interface EmotionIconButtonProps {
  type: 'happy_face' | 'sad_face';
  color?: 'primary' | 'secondary';
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}

const EmotionIconButton = memo(function EmotionIconButton({
  type,
  color = 'secondary',
  onClick,
}: EmotionIconButtonProps) {
  return (
    <Fab color={color} onClick={onClick}>
      <Icon code={type} size="large" />
    </Fab>
  );
});

EmotionIconButton.displayName = 'EmotionIconButton';

export { EmotionIconButton };
