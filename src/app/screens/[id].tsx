import { useLocalSearchParams } from 'expo-router';
import { DesignScreen, screens } from '@/features/designs/DesignScreen';
import { Cancelled, Postponed, SoldOut } from '@/screens/EventStates';
export default function ScreenRoute() {
  const {id} = useLocalSearchParams<{id:string}>();
  // Review the actual native state screens, including their original footers.
  if (id === 'I6') return <SoldOut />;
  if (id === 'I7') return <Cancelled />;
  if (id === 'I8') return <Postponed />;
  return <DesignScreen key={id} id={id} />;
}

export function generateStaticParams() {
  return screens.map(screen => ({id:screen.id}));
}
