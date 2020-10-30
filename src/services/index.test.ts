import {
  calculateNextRepetition,
  // findSequenceDuplicates,
} from './index';
import nanoid from 'nanoid';

describe('spacedRepetion()', () => {
  it('returns a value', () => {
    const result = calculateNextRepetition({
      id: nanoid(),
      isDone: false,
      name: nanoid(),
      userId: nanoid(),
      dueAt: Date.now(),
    });
    expect(typeof result).toBe('object');
  });
});

describe('findSequenceDuplicates()', () => {
  it('returns a value', () => {
    // const result = findSequenceDuplicates();
    // expect(typeof result).toBe('object');
  });
});
