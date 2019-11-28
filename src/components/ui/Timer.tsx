import React, { useState } from 'react';
import Timer from 'react-compound-timer';
import { useAudio, useTimeoutFn } from 'react-use';
import Fab from './Fab';

interface Props {
  className?: string;
}

export default (props: Props) => {
  const [isActive, setIsActive] = useState(false);
  const duration = 5 * 60 * 1000;
  const [audio, , controls] = useAudio({
    src: '/sounds/alert.ogg',
  });

  const [, , audioIntervalReset] = useTimeoutFn(() => {
    if (isActive) controls.play();
  }, duration - 10);

  return (
    <>
      {audio}
      <Timer
        onStop={controls.play}
        direction="backward"
        startImmediately={false}
        initialTime={duration}
      >
        {/*
        // @ts-ignore */}
        {({ start, resume, pause, stop, reset, timerState }) => {
          function toggleTimer() {
            audioIntervalReset();
            isActive ? reset() : start();
            setIsActive(!isActive);
          }
          return (
            <Fab
              color="primary"
              // TODO:
              //   aria-label={t('createTask')}
              onClick={toggleTimer}
              className={props.className}
            >
              <Timer.Minutes />:
              <Timer.Seconds />
            </Fab>
          );
        }}
      </Timer>
    </>
  );
};
