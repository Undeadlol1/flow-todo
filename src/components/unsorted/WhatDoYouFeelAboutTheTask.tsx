import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
} from '@material-ui/core';
import classNames from 'classnames';
import React, { memo } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { useTypedTranslate } from '../../services';
import { EmotionIconButton } from '../ui/EmotionIconButton';

interface Props {
  className?: string;
}

const WhatDoYouFeelAboutTheTask = memo((props: Props) => {
  const t = useTypedTranslate();
  const { url } = useRouteMatch() || { url: '' };
  const rootClasses = classNames(props.className);

  return (
    <Box className={rootClasses} width="100%" textAlign="center">
      <Card className="animated pulse infinite">
        <CardHeader subheader={t('what do you feel')} />
        <CardContent>
          <Grid item container xs={12}>
            <Grid item xs>
              <Link to={`${url}/isGood`}>
                <EmotionIconButton type="happy_face" />
              </Link>
            </Grid>
            <Grid item xs>
              <Link to={`${url}/isTroublesome`}>
                <EmotionIconButton type="sad_face" color="primary" />
              </Link>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
});

WhatDoYouFeelAboutTheTask.displayName = 'WhatDoYouFeelAboutTheTask';

export { WhatDoYouFeelAboutTheTask };
