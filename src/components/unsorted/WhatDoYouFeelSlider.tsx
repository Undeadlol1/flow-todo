import React, { memo } from 'react';
import { Box, Fab, Grid, Slider } from '@material-ui/core';
import SatisfiedIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import DissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

export interface WhatDoYouFeelSliderProps {
  onChange: (value: number) => void;
}

const WhatDoYouFeelSlider = memo(function WhatDoYouFeelSlider(
  props: WhatDoYouFeelSliderProps,
) {
  return (
    <Box>
      <Grid item container justify="space-between">
        <Grid item xs={2}>
          <Box textAlign="center">
            <Fab color="secondary">
              <DissatisfiedIcon fontSize="large" />
            </Fab>
          </Box>
        </Grid>
        <Grid item xs>
          <Box mt="15px">
            <Slider
              min={0}
              max={100}
              step={25}
              defaultValue={0}
              valueLabelDisplay="off"
              onChangeCommitted={(event, value) =>
                props.onChange(value as number)
              }
            />
          </Box>
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
