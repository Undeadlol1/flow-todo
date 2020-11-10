import { Box, Fab, Grid, Theme } from '@material-ui/core';
import SatisfiedIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import DissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import { makeStyles } from '@material-ui/styles';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => ({ root: {} }));

interface WhatDoYouFeelSliderProps {}

const WhatDoYouFeelSlider = memo(function WhatDoYouFeelSlider(
  props: WhatDoYouFeelSliderProps,
) {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Grid item container xs={12}>
        <Grid item xs>
          <Fab component={Link} color="secondary" to={`$isGood`}>
            <SatisfiedIcon fontSize="large" />
          </Fab>
        </Grid>
        <Grid item xs>
          <Fab
            component={Link}
            color="primary"
            to={`$/isTroublesome`}
          >
            <DissatisfiedIcon fontSize="large" />
          </Fab>
        </Grid>
      </Grid>
    </Box>
  );
});

WhatDoYouFeelSlider.displayName = 'WhatDoYouFeelSlider';

export { WhatDoYouFeelSlider };
