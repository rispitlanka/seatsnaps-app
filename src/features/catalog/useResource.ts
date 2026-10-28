import { useCallback, useEffect, useRef, useState } from 'react';
import { toErrorMessage } from '@/lib/api/errors';

/** Keep old requests from replacing data after navigating or changing a filter. */
export function useResource<T>(key: string, loader: () => Promise<T>) {
  const load = useRef(loader);
  load.current = loader;
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{ key: string; data?: T; loading: boolean; error?: string }>({ key, loading: true });
  useEffect(() => {
    let active = true;
    setState({ key, loading: true });
    void load.current().then(data => {
      if (active) setState({ key, data, loading: false });
    }).catch(error => {
      if (active) setState({ key, loading: false, error: toErrorMessage(error, 'Could not load this content. Please try again.') });
    });
    return () => { active = false; };
  }, [key, attempt]);
  const retry = useCallback(() => setAttempt(value => value + 1), []);
  return { ...(state.key === key ? state : { loading: true, data: undefined, error: undefined }), retry };
}
