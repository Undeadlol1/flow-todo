import { calculateSpacedRepetition } from './index';

describe('spacedRepetion()', () => {
  it('returns a value', () => {
    const result = calculateSpacedRepetition();
    expect(typeof result).toBe('object');
  });
});
