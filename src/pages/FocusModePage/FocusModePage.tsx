import React, { memo } from 'react';
import { Box, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { TasksList } from '../../components/tasks/TasksList/TasksList';
import { WhatDoYouFeelSlider } from '../../components/unsorted/WhatDoYouFeelSlider';

const useStyles = makeStyles((theme: Theme) => ({ root: {} }));

interface Props {}

const FocusModePage = memo(function FocusModePage(props: Props) {
  const classes = useStyles();

  // TODO: rename
  function handleFeelingsSliderChange() {}

  return (
    <Box className={classes.root}>
      <WhatDoYouFeelSlider onChange={handleFeelingsSliderChange} />
      <TasksList tasks={[]} loading={false} />
    </Box>
  );
});

FocusModePage.displayName = 'FocusModePage';

export { FocusModePage };
