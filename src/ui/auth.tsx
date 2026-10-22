import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { BackButton, useBottomPad, useTopPad } from './components';
import { T } from './Text';
import { c } from './tokens';

/** Header shared by both create-account steps. */
export function SignupHeader({ step, label }: { step: 1 | 2; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
      <BackButton />
      <View style={{ flex: 1, gap: 6 }}>
        <T w={700} s={12} color={c.muted}>Step {step} of 2 · {label}</T>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <View style={{ flex: 1, height: 4, borderRadius: 999, backgroundColor: c.blue }} />
          <View style={{ flex: 1, height: 4, borderRadius: 999, backgroundColor: step === 2 ? c.blue : c.line }} />
        </View>
      </View>
    </View>
  );
}

export function FormScreen({ gap, children }: { gap: number; children: ReactNode }) {
  const top = useTopPad();
  const bottom = useBottomPad();
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.white }}>
      <StatusBar style="dark" />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, paddingTop: top, paddingHorizontal: 24, paddingBottom: bottom, gap }}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
