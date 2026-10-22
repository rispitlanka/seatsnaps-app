import { createContext, use, type ReactNode } from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';

import { c, font, type Weight } from './tokens';

type Props = TextProps & {
  /** Font weight, mapped to the bundled Plus Jakarta Sans files. */
  w?: Weight;
  s?: number;
  color?: string;
  /** CSS-style line-height multiplier. */
  lh?: number;
  /** CSS-style letter-spacing in em. */
  ls?: number;
  upper?: boolean;
  align?: TextStyle['textAlign'];
};

export function T({ w = 400, s = 14, color = c.ink, lh, ls, upper, align, style, ...rest }: Props) {
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: font[w],
          fontSize: s,
          color,
          lineHeight: lh ? Math.round(s * lh * 10) / 10 : undefined,
          letterSpacing: ls ? ls * s : undefined,
          textTransform: upper ? 'uppercase' : undefined,
          textAlign: align,
        },
        style,
      ]}
    />
  );
}

const AccentContext = createContext<string>(c.blue);

/** Uppercase display heading used across the boards ("FIND YOUR NIGHT."). */
export function Display({
  size = 32,
  color = c.ink,
  accent = c.blue,
  ls = size >= 28 ? -0.03 : -0.02,
  children,
  style,
}: {
  size?: number;
  color?: string;
  accent?: string;
  ls?: number;
  children: ReactNode;
  style?: TextStyle;
}) {
  return (
    <AccentContext value={accent}>
      <T w={800} s={size} lh={1.05} ls={ls} upper color={color} accessibilityRole="header" style={style}>
        {children}
      </T>
    </AccentContext>
  );
}

/** The coloured half of a display heading. */
export function Hl({ children, color }: { children: ReactNode; color?: string }) {
  const accent = use(AccentContext);
  return <Text style={{ color: color ?? accent }}>{children}</Text>;
}
