import { calculateNextRepetition } from './index';

describe('spacedRepetion()', () => {
  it('returns a value', () => {
    const result = calculateNextRepetition({});
    expect(typeof result).toBe('object');
  });
});
