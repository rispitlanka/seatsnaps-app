import { createContext, useContext, useRef, useState, type PropsWithChildren } from 'react';
import { useFonts } from 'expo-font';
import { models } from './generated/logic';
import { DesignLogic, type Values } from './model';

type DemoState = {
  city: string;
  booking: { count: number; subtotal: number; summary: string; seats: string[]; section: string; promo: boolean };
  saved: boolean;
  followed: boolean;
  form: Record<string, Record<string,string>>;
  notice: string;
};
type Store = {
  data: DemoState;
  update: (value: Partial<DemoState>) => void;
  model: (id: string) => DesignLogic;
  notify: (message: string) => void;
  setField: (screen: string, key: string, value: string) => void;
  reset: () => void;
};
const Context = createContext<Store | null>(null);
const initial = (): DemoState => ({ city:'Colombo', booking:{count:2,subtotal:10000,summary:'2 × Gold',seats:['G5','G6'],section:'Gold Centre',promo:false}, saved:false, followed:false, form:{}, notice:'' });
export function DesignProvider({ children }: PropsWithChildren) {
  const [fontsLoaded,fontError] = useFonts({
    Jakarta400: require('../../../assets/designs/Jakarta-400.ttf'),
    Jakarta500: require('../../../assets/designs/Jakarta-500.ttf'),
    Jakarta600: require('../../../assets/designs/Jakarta-600.ttf'),
    Jakarta700: require('../../../assets/designs/Jakarta-700.ttf'),
    Jakarta800: require('../../../assets/designs/Jakarta-800.ttf'),
  });
  const instances = useRef<Record<string, DesignLogic>>({});
  const [data, setData] = useState(initial);
  const update = (patch: Partial<DemoState>) => setData(s => ({ ...s, ...patch }));
  const model = (id: string) => {
    if (!instances.current[id]) instances.current[id] = models[id] ? new models[id]() : new DesignLogic();
    return instances.current[id];
  };
  if(!fontsLoaded && !fontError) return null;
  return <Context.Provider value={{
    data, update, model,
    notify: notice => update({ notice }),
    setField: (screen, key, value) => setData(s => ({ ...s, form:{ ...s.form, [screen]:{ ...s.form[screen], [key]:value } } })),
    reset: () => { instances.current = {}; setData(initial()); },
  }}>{children}</Context.Provider>;
}
export function useDesignStore() {
  const store = useContext(Context);
  if (!store) throw new Error('DesignProvider is required');
  return store;
}
