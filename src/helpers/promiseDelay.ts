import delay from 'lodash/fp/delay';

export async function promiseDelay(time: number): Promise<void> {
  return new Promise(delay(time));
}
