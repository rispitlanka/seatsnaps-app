import { useLocalSearchParams } from 'expo-router';
import { DesignScreen, screens } from '@/features/designs/DesignScreen';
export default function ScreenRoute() {
  const {id} = useLocalSearchParams<{id:string}>();
  return <DesignScreen key={id} id={id} />;
}

export function generateStaticParams() {
  return screens.map(screen => ({id:screen.id}));
}
