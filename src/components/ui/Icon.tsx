import { Box, Theme } from '@material-ui/core';
import SatisfiedIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import DissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import { makeStyles } from '@material-ui/styles';
import React, { memo } from 'react';

const useStyles = makeStyles((theme: Theme) => ({ root: {} }));

export type Icons = 'happy_face' | 'sad_face';

export interface IconProps {
  code: Icons;
  size?: 'large' | 'small' | 'default';
}

const Icon = memo(function Icon({
  code,
  size = 'default',
}: IconProps) {
  const classes = useStyles();
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
  return <Box className={classes.root}>{getIconByCode()}</Box>;
});

Icon.displayName = 'Icon';

export { Icon };
