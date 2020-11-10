import { Box, Fab, Grid, Slider } from '@material-ui/core';
import SatisfiedIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import DissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import React, { memo } from 'react';

interface WhatDoYouFeelSliderProps {}

const WhatDoYouFeelSlider = memo(function WhatDoYouFeelSlider(
  props: WhatDoYouFeelSliderProps,
) {
  return (
    <Box mt={10}>
      <Grid item container justify="space-between">
        <Grid item xs={2}>
          <Box textAlign="center">
            <Fab color="secondary">
              <DissatisfiedIcon fontSize="large" />
            </Fab>
          </Box>
        </Grid>
        <Grid item xs>
          <Slider
            min={0}
            max={100}
            step={25}
            defaultValue={0}
            valueLabelDisplay="off"
            onChangeCommitted={console.log}
          />
        </Grid>
        <Grid item xs={2}>
          <Box textAlign="center">
            <Fab color="primary">
              <SatisfiedIcon fontSize="large" />
            </Fab>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
});

WhatDoYouFeelSlider.displayName = 'WhatDoYouFeelSlider';

export { WhatDoYouFeelSlider };
