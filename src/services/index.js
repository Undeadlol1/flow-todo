// @flow
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';

type Interval = {
  dueAt: number,
  repetitionLevel: number,
};

type Confidence = 'bad' | 'normal' | 'good';

function calculateNextRepetition(
  previous: Interval,
  confidence: Confidence = 'normal',
): Interval {
  console.log('previous: ', previous);
  console.log('confidence: ', confidence);
  const today = new Date();
  const levels = [
    addDays(today, 1),
    addDays(today, 3),
    addDays(today, 9),
    addMonths(today, 1),
    addMonths(today, 3),
    addMonths(today, 9),
    addMonths(today, 27),
  ];

  let newLevelIndex = previous.repetitionLevel || -1;

  if (confidence === 'normal') newLevelIndex += 1;
  else if (confidence === 'good') newLevelIndex += 2;
  else if (confidence === 'bad') newLevelIndex -= 2;

  if (newLevelIndex <= 0) newLevelIndex = 0;
  else if (newLevelIndex >= levels.length) newLevelIndex = levels.length - 1;

  console.log('newPosition: ', newLevelIndex);
  return {
    repetitionLevel: newLevelIndex,
    dueAt: levels[newLevelIndex].getTime(),
  };
}

export { calculateNextRepetition };
