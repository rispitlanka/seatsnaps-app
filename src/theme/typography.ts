import { TextStyle } from "react-native";

export const typography = {
  display: {
    fontSize: 32,
    fontWeight: "600",
    lineHeight: 40,
    letterSpacing: -0.6,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  caption: {
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
  },
} satisfies Record<string, TextStyle>;
