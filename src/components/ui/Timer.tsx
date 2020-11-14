import React, { useState } from 'react';
import ReactTimer from 'react-compound-timer';
import { useAudio, useTimeoutFn } from 'react-use';
import Fab from './Fab';

interface Props {
  // Run function on timer stop.
  onEnd?: () => any;
  onStart?: () => any;
  autoStart?: boolean;
  className?: string;
}

export default function Timer(props: Props) {
  const timerDuration = (5 * 60 * 1000) / 2;
  const [isActive, setIsActive] = useState(props.autoStart);
  const [isAutoStarted, setIsAutoStarted] = useState(false);
  const [audio, , controls] = useAudio({ src: '/sounds/alert.ogg' });

  const [, , audioIntervalReset] = useTimeoutFn(() => {
    if (isActive) controls.play();
  }, timerDuration - 10);

  // Run function on timer stop.
  // TODO: make sure this doesn't always run. Not all timers are autostarted.
  useTimeoutFn(props.onEnd || (() => {}), timerDuration);
  return (
    <>
      {audio}
      <ReactTimer
        // @ts-ignore
        formatValue={val => {
          // Timer returns '0' seconds by default'.
          if (val === 0) return '00';
          return val;
        }}
        // @ts-ignore
        direction="backward"
        // @ts-ignore
        startImmediately={false}
        initialTime={timerDuration}
        onStart={props.onStart}
        onStop={props.onEnd}
      >
        {/*
        // @ts-ignore */}
        {({ start, resume, pause, stop, reset, timerState }) => {
          if (props.autoStart && !isAutoStarted) {
            // NOTE: timeout is used as a workaround to prevent
            // "Warning: Cannot update during an existing state transition".
            setTimeout(() => {
              start();
              setIsAutoStarted(true);
            }, 100);
          }
          function toggleTimer() {
            audioIntervalReset();
            isActive ? reset() : start();
            setIsActive(!isActive);
          }
          return (
            <Fab
              color="primary"
              className={props.className}
              onClick={toggleTimer}
            >
              <ReactTimer.Minutes />
              :
              <ReactTimer.Seconds />
            </Fab>
          );
        }}
      </ReactTimer>
    </>
  );
}
