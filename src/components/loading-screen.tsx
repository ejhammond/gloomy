import * as React from 'react';
import { Loading } from '../providers/loading';

export function LoadingScreen({ message }: { message: string }) {
  return (
    <>
      <Loading />
      <div>{message}</div>
    </>
  );
}
