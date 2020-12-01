import { Box, Grid, Slider } from '@material-ui/core';
import React, { memo, useState } from 'react';
import { EmotionIconButton } from '../ui/EmotionIconButton';
import { EmotionTypes } from '../ui/EmotionIconButton/EmotionIconButton';

export interface WhatDoYouFeelSliderProps {
  onChange: (value: number) => void;
}

const WhatDoYouFeelSlider = memo(function WhatDoYouFeelSlider(
  props: WhatDoYouFeelSliderProps,
) {
  const [sliderValue, setSliderValue] = useState(50);
  return (
    <Box>
      <Grid item container justify="space-between">
        <Grid item xs={12}>
          <Box textAlign="center">
            <EmotionIconButton
              type={getEmotionBasedOnPercentage(sliderValue)}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box mt="15px">
            <Slider
              min={0}
              max={100}
              step={25}
              track={false}
              valueLabelDisplay="off"
              defaultValue={sliderValue}
              onChange={(_, value) => {
                setSliderValue(value as number);
              }}
              onChangeCommitted={(_, value) => {
                props.onChange(value as number);
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
});

function getEmotionBasedOnPercentage(
  selectedPercentage: number,
): EmotionTypes {
  if (selectedPercentage < 26) return 'ko_face';
  if (selectedPercentage < 51) return 'sad_face';
  if (selectedPercentage < 76) return 'happy_face';
  return 'blissful_face';
}

export { WhatDoYouFeelSlider };
