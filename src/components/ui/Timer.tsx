import React, { useState } from 'react';
import ReactTimer from 'react-compound-timer';
import { useAudio, useTimeoutFn } from 'react-use';
import Fab from './Fab';

interface Props {
  // Run function on timer stop.
  onEnd?: Function;
  onStart?: Function;
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
  useTimeoutFn(props.onEnd || function() {}, timerDuration);
  return (
    <>
      {audio}
      <ReactTimer
        // @ts-ignore
        formatValue={val => {
          // Timer returns '0' seconds by default'.
          if (val === 0) return '00';
          else return val;
        }}
        // @ts-ignore
        onStart={props.onStart}
        // @ts-ignore
        onStop={props.onEnd}
        direction="backward"
        startImmediately={false}
        initialTime={timerDuration}
      >
        {/*
        // @ts-ignore */}
        {({ start, resume, pause, stop, reset, timerState }) => {
          if (props.autoStart && !isAutoStarted) {
            // NOTE: timeout is used as a workaround to prevent
            // "Warning: Cannot update during an existing state transition".
            setTimeout(start, 100);
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
              <ReactTimer.Minutes />:
              <ReactTimer.Seconds />
            </Fab>
          );
        }}
      </ReactTimer>
    </>
  );
}
