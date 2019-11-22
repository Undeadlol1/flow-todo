import React, { useState } from 'react';
import Timer from 'react-compound-timer';
import Fab from '@material-ui/core/Fab';

export default () => {
  const [isActive, setIsActive] = useState(false);
  function callback() {
    console.log('timer is stopped');
    console.log('soudn should be played');
  }
  return (
    <Timer
      onStop={callback}
      direction="backward"
      startImmediately={false}
      initialTime={5 * 60 * 1000}
    >
      {/*
        // @ts-ignore */}
      {({ start, resume, pause, stop, reset, timerState }) => {
        function toggleTimer() {
          isActive ? reset() : start();
          setIsActive(!isActive);
        }
        return (
          <Fab
            color="primary"
            //   aria-label={t('createTask')}
            //   className={cx([classes.fab, 'IntroHandle__createTask'])}
            onClick={toggleTimer}
          >
            <Timer.Minutes />:
            <Timer.Seconds />
          </Fab>
        );
      }}
    </Timer>
  );
};
