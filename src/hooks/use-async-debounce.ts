import * as React from 'react';

// source: https://github.com/tannerlinsley/react-table/blob/master/src/publicUtils.js

function useGetLatest<T>(obj: T): () => T {
  const ref = React.useRef<T>();
  ref.current = obj;

  return React.useCallback(() => ref.current, []);
}

export function useAsyncDebounce(defaultFn: (...args) => Promise<any>, defaultWait = 0) {
  const debounceRef = React.useRef<{
    promise?: Promise<any>;
    resolve?: (promise: Promise<any>) => void;
    reject?: (error: Error) => void;
    timeout?: NodeJS.Timeout;
  }>({});

  const getDefaultFn = useGetLatest(defaultFn);
  const getDefaultWait = useGetLatest(defaultWait);

  return React.useCallback(
    async (...args) => {
      if (!debounceRef.current.promise) {
        debounceRef.current.promise = new Promise((resolve, reject) => {
          debounceRef.current.resolve = resolve;
          debounceRef.current.reject = reject;
        });
      }

      if (debounceRef.current.timeout) {
        clearTimeout(debounceRef.current.timeout);
      }

      debounceRef.current.timeout = setTimeout(async () => {
        delete debounceRef.current.timeout;
        try {
          debounceRef.current.resolve(await getDefaultFn()(...args));
        } catch (err) {
          debounceRef.current.reject(err);
        } finally {
          delete debounceRef.current.promise;
        }
      }, getDefaultWait());

      return debounceRef.current.promise;
    },
    [getDefaultFn, getDefaultWait],
  );
}
