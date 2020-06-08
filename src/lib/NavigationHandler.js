import { createRef } from 'react';

// added to be on the safe side to make sure app is mounted
export const isMountedRef = createRef();

export const navigationRef = createRef();

export function navigate(name, params) {
  if (isMountedRef.current && navigationRef.current) {
    navigationRef.current._navigation.navigate(name, params);
  }
  else {
    console.log("App has not mounted");
  }
}
