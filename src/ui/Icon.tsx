import type { ReactNode } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { c } from './tokens';

/** Icon paths copied verbatim from the design boards (24×24 viewBox, stroked). */
const icons = {
  mail: <><Rect x="3" y="5" width="18" height="14" rx="2" /><Path d="m3 7 9 6 9-6" /></>,
  lock: <><Rect x="5" y="11" width="14" height="10" rx="2" /><Path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  eye: <><Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><Circle cx="12" cy="12" r="3" /></>,
  chevronLeft: <Path d="m15 18-6-6 6-6" />,
  chevronRight: <Path d="m9 6 6 6-6 6" />,
  chevronDown: <Path d="m6 9 6 6 6-6" />,
  arrowRight: <Path d="M5 12h14M13 6l6 6-6 6" />,
  check: <Path d="m5 12 5 5 9-10" />,
  close: <Path d="M6 6l12 12M18 6 6 18" />,
  wallet: <><Rect x="3" y="6" width="18" height="14" rx="3" /><Path d="M3 10h18" /></>,
  bell: <><Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><Path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" /></>,
  search: <><Circle cx="11" cy="11" r="7" /><Path d="m20 20-3.5-3.5" /></>,
  sliders: <><Path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" /><Circle cx="16" cy="6" r="2" /><Circle cx="10" cy="12" r="2" /><Circle cx="18" cy="18" r="2" /></>,
  music: <><Path d="M9 18V5l12-2v13" /><Circle cx="6" cy="18" r="3" /><Circle cx="18" cy="16" r="3" /></>,
  flag: <><Path d="M4 22V4" /><Path d="M4 4h13l-3 4 3 4H4" /></>,
  mic: <><Rect x="9" y="2" width="6" height="11" rx="3" /><Path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" /></>,
  trophy: <><Path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" /><Path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" /></>,
  users: <><Circle cx="9" cy="8" r="3.5" /><Path d="M2 21a7 7 0 0 1 14 0" /><Circle cx="17" cy="7" r="2.5" /><Path d="M17 13a5 5 0 0 1 5 5" /></>,
  grid: <><Rect x="3" y="3" width="7" height="7" rx="2" /><Rect x="14" y="3" width="7" height="7" rx="2" /><Rect x="3" y="14" width="7" height="7" rx="2" /><Rect x="14" y="14" width="7" height="7" rx="2" /></>,
  home: <Path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  compass: <><Circle cx="12" cy="12" r="9" /><Path d="m15.5 8.5-2 5-5 2 2-5z" /></>,
  tag: <><Path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" /><Circle cx="7.5" cy="7.5" r="1.5" /></>,
  user: <><Circle cx="12" cy="8" r="4" /><Path d="M4 21a8 8 0 0 1 16 0" /></>,
  share: <><Path d="M12 3v12" /><Path d="m7 8 5-5 5 5" /><Path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" /></>,
  bookmark: <Path d="M19 21 12 16l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
  recent: <><Circle cx="12" cy="12" r="9" /><Path d="M12 7v5l3 2" /></>,
  trending: <><Path d="m3 17 6-6 4 4 8-8" /><Path d="M15 7h6v6" /></>,
  pin: <><Path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><Circle cx="12" cy="10" r="2.5" /></>,
  calendar: <><Rect x="3" y="5" width="18" height="16" rx="2" /><Path d="M3 10h18M8 3v4M16 3v4" /></>,
  calendarPlus: <><Rect x="3" y="5" width="18" height="16" rx="2" /><Path d="M3 10h18M8 3v4M16 3v4M12 13v5M9.5 15.5h5" /></>,
  navigate: <Path d="m3 11 18-8-8 18-2-8z" />,
  info: <><Circle cx="12" cy="12" r="9" /><Path d="M12 8h.01M11 12h1v4h1" /></>,
  minus: <Path d="M5 12h14" />,
  plus: <Path d="M12 5v14M5 12h14" />,
  timer: <><Circle cx="12" cy="13" r="8" /><Path d="M12 9v4l2 2M9 2h6" /></>,
  heart: <Path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />,
  ticket: <Path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z" />,
  card: <><Rect x="2" y="5" width="20" height="14" rx="2" /><Path d="M2 10h20" /></>,
  gear: <><Circle cx="12" cy="12" r="3" /><Path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>,
  shield: <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  help: <><Circle cx="12" cy="12" r="9" /><Path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" /></>,
  pencil: <Path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />,
  logout: <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
  phone: <><Rect x="6" y="2" width="12" height="20" rx="2" /><Path d="M11 18h2" /></>,
  monitor: <><Rect x="2" y="4" width="20" height="13" rx="2" /><Path d="M8 21h8M12 17v4" /></>,
  alert: <><Circle cx="12" cy="12" r="9" /><Path d="M12 8v5M12 16h.01" /></>,
  dot: <Circle cx="12" cy="12" r="8" />,
  list: <Path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  searchMinus: <><Circle cx="11" cy="11" r="7" /><Path d="m20 20-3.5-3.5M8.5 11h5" /></>,
  cardX: <><Rect x="2" y="5" width="20" height="14" rx="2" /><Path d="M2 10h20M15 14l4 4M19 14l-4 4" /></>,
  xCircle: <><Circle cx="12" cy="12" r="9" /><Path d="m15 9-6 6M9 9l6 6" /></>,
  download: <Path d="M12 3v12M7 10l5 5 5-5M5 21h14" />,
  userPlus: <><Circle cx="9" cy="8" r="3.5" /><Path d="M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6" /></>,
  plane: <Path d="m22 2-11 11M22 2l-7 20-4-9-9-4z" />,
  sun: <><Circle cx="12" cy="12" r="4" /><Path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  chat: <Path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />,
  call: <Path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />,
  clip: <Path d="m21.4 11-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5" />,
  external: <Path d="M7 17 17 7M8 7h9v9" />,
  trash: <Path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />,
  wifiOff: <Path d="M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M2 8.8a15 15 0 0 1 4.2-2.6M10.7 5a15 15 0 0 1 11.3 3.8M5 12.9a10 10 0 0 1 5.2-2.8M16.9 11.3a10 10 0 0 1 2.1 1.6M12 20h.01" />,
  wrench: <Path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z" />,
  star: <Path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2 6.4 20.2l1.1-6.3L2.9 9.5l6.3-.9z" />,
  camera: <><Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><Circle cx="12" cy="13" r="4" /></>,
  gallery: <><Rect x="3" y="3" width="18" height="18" rx="2" /><Circle cx="8.5" cy="8.5" r="1.5" /><Path d="m21 15-5-5L5 21" /></>,
  send: <><Circle cx="18" cy="5" r="3" /><Circle cx="6" cy="12" r="3" /><Circle cx="18" cy="19" r="3" /><Path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></>,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof icons;

export function Icon({
  name,
  size = 20,
  color = c.ink,
  stroke = 2,
}: {
  name: IconName;
  size?: number;
  color?: string;
  stroke?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </Svg>
  );
}

export function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </Svg>
  );
}

export function VerifiedIcon({ size = 15, color = c.blue }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="Verified">
      <Circle cx="12" cy="12" r="10" fill={color} />
      <Path d="m8 12 3 3 5-6" fill="none" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
