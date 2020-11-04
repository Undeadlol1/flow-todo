import { getUniqueId } from '../helpers/getUniqueId';
import {
  calculateNextRepetition,
  // findSequenceDuplicates,
} from './index';

describe('spacedRepetion()', () => {
  it('returns a value', () => {
    const result = calculateNextRepetition({
      id: getUniqueId(),
      isDone: false,
      name: getUniqueId(),
      userId: getUniqueId(),
      dueAt: Date.now(),
      createdAt: Date.now(),
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
