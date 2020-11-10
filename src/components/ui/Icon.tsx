import { Box, Theme } from '@material-ui/core';
import SatisfiedIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import DissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import { makeStyles } from '@material-ui/styles';
import React, { memo } from 'react';

const useStyles = makeStyles((theme: Theme) => ({ root: {} }));

export type Icons = 'happy_face' | 'sad_face';

export interface IconProps {
  code: Icons;
}

function getIconByCode(type: Icons) {
  switch (type) {
    case 'happy_face':
      return <SatisfiedIcon />;
    case 'sad_face':
      return <DissatisfiedIcon />;
    default:
      return <SatisfiedIcon />;
  }
}

const Icon = memo(function Icon(props: IconProps) {
  const classes = useStyles();
  return (
    <Box className={classes.root}>{getIconByCode(props.code)}</Box>
  );
});

Icon.displayName = 'Icon';

export { Icon };
