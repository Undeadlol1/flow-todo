// @flow
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';

type Interval = {
  dueAt: number,
  intervalIndex: number,
};

type Confidence = 0 | 1 | 2;

function calculateSpacedRepetition(
  previous: Interval,
  confidence: Confidence = 1,
): Interval {
  console.log('previous: ', previous);
  console.log('confidence: ', confidence);
  const today = new Date();
  const steps = [
    addDays(today, 1),
    addDays(today, 3),
    addDays(today, 9),
    addMonths(today, 1),
    addMonths(today, 3),
    addMonths(today, 9),
    addMonths(today, 27),
  ];

  let newPosition = (previous && previous.intervalIndex) || -1;
  if (confidence === 1) newPosition += 1;
  else if (confidence === 2) newPosition += 2;
  else newPosition -= 2;
  if (newPosition < 0) newPosition = 0;

  console.log('newPosition: ', newPosition);
  return {
    intervalIndex: newPosition,
    dueAt: steps[newPosition].getTime(),
  };
}

export { calculateSpacedRepetition };
