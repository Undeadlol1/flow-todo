import { Box, Fab, Grid, Slider, Theme } from '@material-ui/core';
import SatisfiedIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import DissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import { makeStyles } from '@material-ui/styles';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => ({ root: {} }));

interface WhatDoYouFeelSliderProps {}

const marks = [
  {
    value: 0,
    label: '0°C',
  },
  {
    value: 20,
    label: '20°C',
  },
  {
    value: 37,
    label: '37°C',
  },
  {
    value: 100,
    label: '100°C',
  },
];

function valuetext(value: number) {
  return `${value}°C`;
}

function valueLabelFormat(value: number) {
  return marks.findIndex((mark) => mark.value === value) + 1;
}

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
          <Slider
            defaultValue={20}
            valueLabelFormat={valueLabelFormat}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider-restrict"
            step={null}
            valueLabelDisplay="auto"
            marks={marks}
          />
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
