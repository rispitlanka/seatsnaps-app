import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

import { Field, Tap, TextButton, goBack, useBottomPad } from '@/ui/components';
import { BottomSheet, ResultBadge } from '@/ui/states';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

const consequences = [
  'Your profile, saved events and payment methods are deleted.',
  'Tickets for {event} stay valid — we\'ll email them to you.',
  'Past orders are kept for [n] years for tax records, then removed.',
];

/** J10 Delete account confirm. The API has no delete endpoint yet, so confirming only explains that. */
export default function DeleteAccount() {
  const bottom = useBottomPad();
  const [typed, setTyped] = useState('');
  const [notice, setNotice] = useState('');
  const ok = typed.trim().toUpperCase() === 'DELETE';

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <BottomSheet offset={120} label="Delete your account" backdrop="rgba(10,17,48,0.72)">
        <View style={{ flex: 1, paddingHorizontal: 24, paddingBottom: bottom, gap: 16 }}>
          <View style={{ marginTop: 22 }}>
            <ResultBadge icon="trash" bg={c.errorSoft} color={c.error} size={60} iconSize={26} stroke={2.2} />
          </View>
          <Display size={28} accent={c.error}>Delete your <Hl>account?</Hl></Display>
          <T s={14} lh={1.5} color={c.ink2}>This can&apos;t be undone. Here&apos;s what happens:</T>
          <View style={{ backgroundColor: c.page, borderRadius: 16, paddingVertical: 14, paddingLeft: 18, paddingRight: 14, gap: 8 }}>
            {consequences.map(line => {
              const [before, after] = line.split('{event}');
              return (
                <View key={line} style={{ flexDirection: 'row', gap: 8 }}>
                  <T s={13} lh={1.5} color={c.ink2}>•</T>
                  <T s={13} lh={1.5} color={c.ink2} style={{ flex: 1 }}>
                    {before}
                    {after !== undefined ? <><T w={700} s={13}>Tamil Fest 2026</T>{after}</> : null}
                  </T>
                </View>
              );
            })}
          </View>
          <View style={{ gap: 6 }}>
            <T w={600} s={13}>Type <T w={800} s={13}>DELETE</T> to confirm</T>
            <Field accessibilityLabel="Type DELETE to confirm" placeholder="DELETE" autoCapitalize="characters" autoCorrect={false} value={typed} onChangeText={setTyped} style={{ letterSpacing: 1.5 }} />
          </View>
          {notice ? <T s={13} color={c.error} accessibilityRole="alert">{notice}</T> : null}
          <View style={{ marginTop: 'auto', gap: 8 }}>
            <Tap
              accessibilityRole="button"
              accessibilityState={{ disabled: !ok }}
              disabled={!ok}
              onPress={() => setNotice("Account deletion isn't available in the app yet — contact support to delete your account.")}
              style={{ height: 54, borderRadius: 999, backgroundColor: ok ? c.error : c.errorMuted, alignItems: 'center', justifyContent: 'center' }}
            >
              <T w={800} s={16} color={c.white}>Delete my account</T>
            </Tap>
            <TextButton label="Keep my account" height={48} onPress={() => goBack()} />
          </View>
        </View>
      </BottomSheet>
    </KeyboardAvoidingView>
  );
}
