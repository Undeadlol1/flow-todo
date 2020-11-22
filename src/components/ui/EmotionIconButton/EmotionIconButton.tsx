import { IconButton, useTheme } from '@material-ui/core';
import React, { memo } from 'react';
import { Planet } from 'react-kawaii';

type EmotionTypes =
  | 'happy_face'
  | 'sad_face'
  | 'blissful_face'
  | 'ko_face';

export interface EmotionIconButtonProps {
  type: EmotionTypes;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}
const EmotionIconButton = memo(function EmotionIconButton({
  type,
  onClick,
}: EmotionIconButtonProps) {
  const theme = useTheme();

  function geticon() {
    const kawaiiIconSize = 75;
    switch (type) {
      case 'happy_face':
        return (
          <Planet
            mood="happy"
            size={kawaiiIconSize}
            color={theme.palette.primary.main}
          />
        );
      case 'sad_face':
        return (
          <Planet
            mood="sad"
            size={kawaiiIconSize}
            color={theme.palette.secondary.main}
          />
        );
      case 'ko_face':
        return (
          <Planet
            mood="ko"
            size={kawaiiIconSize}
            color={theme.palette.secondary.main}
          />
        );
      case 'blissful_face':
        return (
          <Planet
            mood="blissful"
            size={kawaiiIconSize}
            color={theme.palette.secondary.main}
          />
        );
    }
  }

  return (
    <IconButton style={{ padding: 0 }} onClick={onClick}>
      {geticon()}
    </IconButton>
  );
});

EmotionIconButton.displayName = 'EmotionIconButton';

export { EmotionIconButton };
