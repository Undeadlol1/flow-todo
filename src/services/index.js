// @flow
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import formatDistance from 'date-fns/formatDistance';
import debug from 'debug';

const logger = debug('utils');
debug.enable('utils');

type Repetition = {
  dueAt: number,
  repetitionLevel: number,
};

type Confidence = 'bad' | 'normal' | 'good';

function calculateNextRepetition(
  task: Object,
  confidence: Confidence = 'normal',
): Repetition {
  logger('task: ', task);
  logger('confidence: ', confidence);
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

  let newLevelIndex = task.repetitionLevel || -1;

  if (confidence === 'normal') newLevelIndex += 1;
  else if (confidence === 'good') newLevelIndex += 2;
  else if (confidence === 'bad') newLevelIndex -= 2;

  if (newLevelIndex < 0) newLevelIndex = 0;
  else if (newLevelIndex >= levels.length) newLevelIndex = levels.length - 1;

  logger('levels: %O', levels);
  logger('newLevelIndex: ', newLevelIndex);
  logger('dueAt', levels[newLevelIndex]);
  logger(
    `This means ${formatDistance(
      Date.now(),
      levels[newLevelIndex],
    )} from now`,
  );

  return {
    repetitionLevel: newLevelIndex,
    dueAt: levels[newLevelIndex].getTime(),
  };
}

export { calculateNextRepetition };
