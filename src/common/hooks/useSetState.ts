import { useCallback, useState } from "react";

function useSetState<T extends {}>(
  initialState: T = {} as T
): [T, (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void] {
  const [state, set] = useState<T>(initialState);

  const setState = useCallback((patch: any) => {
    set((preState: Partial<T> | Function) =>
      Object.assign(
        {},
        preState,
        typeof patch === 'function' ? patch(preState) : patch
      )
    );
  }, []);

  return [state, setState];
}

export default useSetState;