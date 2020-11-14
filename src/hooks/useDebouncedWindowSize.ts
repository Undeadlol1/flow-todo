import { useEffect, useState } from 'react';

type windowDimensions = {
  width: number | undefined;
  height: number | undefined;
};

// NOTE: this is copypaste.
export function useDebouncedWindowSize(
  debounceTime?: number,
): windowDimensions {
  const isClient: boolean = typeof window === 'object';
  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  }
  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    let handleResizeFn = handleResize;

    if (debounceTime) {
      handleResizeFn = debounce(debounceTime, handleResize);
    }

    window.addEventListener('resize', handleResizeFn);

    return () => window.removeEventListener('resize', handleResizeFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceTime, isClient]);

  return windowSize;
}

// NOTE: this is a copy/paste.
function debounce(delay: number, fn: any) {
  let timerId: any;

  return function (...args: any[]) {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
}
