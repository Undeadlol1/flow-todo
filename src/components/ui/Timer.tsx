import React, { useState } from 'react';
import Timer from 'react-compound-timer';
import { useAudio, useTimeoutFn } from 'react-use';
import Fab from './Fab';

interface Props {
  autoStart?: boolean;
  className?: string;
}

export default (props: Props) => {
  const [isActive, setIsActive] = useState(props.autoStart);
  // TODO rename
  const [isAutoStarted, setIsAutoStarted] = useState(false);
  const duration = 5 * 60 * 1000;
  const [audio, , controls] = useAudio({ src: '/sounds/alert.ogg' });

  const [, , audioIntervalReset] = useTimeoutFn(() => {
    if (isActive) controls.play();
  }, duration - 10);

  return (
    <>
      {audio}
      <Timer
        // @ts-ignore
        formatValue={val => {
          // Timer returns '0' seconds by default'.
          if (val === 0) return '00';
          else return val;
        }}
        onStop={controls.play}
        direction="backward"
        startImmediately={false}
        initialTime={duration}
      >
        {/*
        // @ts-ignore */}
        {({ start, resume, pause, stop, reset, timerState }) => {
          if (props.autoStart && !isAutoStarted) {
            start();
            setIsAutoStarted(true);
          }
          function toggleTimer() {
            audioIntervalReset();
            isActive ? reset() : start();
            setIsActive(!isActive);
          }
          return (
            <Fab
              color="primary"
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
