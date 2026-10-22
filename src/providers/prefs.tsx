import { createContext, use, useMemo, useState, type PropsWithChildren } from 'react';

/** App preferences chosen on-device (city for event discovery). */
type Prefs = { city: string; setCity: (city: string) => void };

const PrefsContext = createContext<Prefs | null>(null);

export function PrefsProvider({ children }: PropsWithChildren) {
  const [city, setCity] = useState('Colombo');
  const value = useMemo(() => ({ city, setCity }), [city]);
  return <PrefsContext value={value}>{children}</PrefsContext>;
}

export function usePrefs() {
  const value = use(PrefsContext);
  if (!value) throw new Error('usePrefs must be used inside <PrefsProvider />');
  return value;
}
