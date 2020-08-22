import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Fab,
  Grid,
  Theme,
} from '@material-ui/core';
import SatisfiedIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import DissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import React, { memo } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { useTypedTranslate } from '../../services';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

interface Props {
  className?: string;
}

const WhatDoYouFeelAboutTheTask = memo((props: Props) => {
  const classes = useStyles();
  const t = useTypedTranslate();
  const { url } = useRouteMatch() || { url: '' };
  const rootClasses = classNames(classes.root, props.className);

  return (
    <Box className={rootClasses} width="100%" textAlign="center">
      <Card className="animated pulse infinite">
        <CardHeader subheader={t('what do you feel')} />
        <CardContent>
          <Grid item container xs={12}>
            <Grid item xs>
              <Fab
                component={Link}
                color="secondary"
                to={url + '/isGood'}
              >
                <SatisfiedIcon fontSize="large" />
              </Fab>
            </Grid>
            <Grid item xs>
              <Fab
                component={Link}
                color="primary"
                to={url + '/isTroublesome'}
              >
                <DissatisfiedIcon fontSize="large" />
              </Fab>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
});

WhatDoYouFeelAboutTheTask.displayName = 'WhatDoYouFeelAboutTheTask';

export { WhatDoYouFeelAboutTheTask };
