import { Box, Grid, Slider } from '@material-ui/core';
import React, { memo } from 'react';
import { EmotionIconButton } from '../ui/EmotionIconButton';

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
            <EmotionIconButton type="sad_face" />
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
            <EmotionIconButton type="happy_face" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
});

WhatDoYouFeelSlider.displayName = 'WhatDoYouFeelSlider';

export { WhatDoYouFeelSlider };
