import { Box } from '@material-ui/core';
import SatisfiedIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import DissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import React, { memo } from 'react';

export type Icons = 'happy_face' | 'sad_face';

export interface IconProps {
  code: Icons;
  size?: 'large' | 'small' | 'default';
}

const Icon = memo(function Icon({
  code,
  size = 'default',
}: IconProps) {
  function getIconByCode() {
    switch (code) {
      case 'happy_face':
        return <SatisfiedIcon fontSize={size} />;
      case 'sad_face':
        return <DissatisfiedIcon fontSize={size} />;
      default:
        return <SatisfiedIcon fontSize={size} />;
    }
  }
  return <Box display="flex">{getIconByCode()}</Box>;
});

Icon.displayName = 'Icon';

export { Icon };
