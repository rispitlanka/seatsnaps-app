import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import { Field, PrimaryButton, Tap, TextButton } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { SettingsScreen } from '@/ui/settings';
import { Callout, ResultBadge } from '@/ui/states';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** J2 Send a ticket, with the sent state. Transfers aren't submitted to the API yet. */
export default function SendTicket() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');

  if (sent) {
    return (
      <SettingsScreen>
        <View style={{ flex: 1, alignItems: 'center', gap: 14, paddingTop: 50 }}>
          <ResultBadge icon="plane" bg={c.blueSoft} color={c.blue} stroke={2.2} />
          <Display>Ticket <Hl>sent.</Hl></Display>
          <T s={14} lh={1.5} color={c.ink2} align="center">We&apos;ll let you know when {name.trim() || 'your friend'} accepts seat G6.</T>
          <View style={{ marginTop: 'auto', width: '100%', gap: 6 }}>
            <PrimaryButton label="Back to booking" onPress={() => router.back()} />
            <TextButton label="Cancel transfer" color={c.error} onPress={() => setSent(false)} />
          </View>
        </View>
      </SettingsScreen>
    );
  }

  return (
    <SettingsScreen>
      <View style={{ gap: 8 }}>
        <Display>Send a <Hl>ticket.</Hl></Display>
        <T s={14} lh={1.5} color={c.ink2}>Your friend gets their own QR code. Yours stays the same.</T>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: c.white, borderWidth: 2, borderColor: c.blue, borderRadius: 18 }}>
        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: c.blueSoft, alignItems: 'center', justifyContent: 'center' }}>
          <T w={800} s={14} color={c.blueDeep}>G6</T>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <T w={800} s={15}>Tamil Fest 2026 · Gold</T>
          <T s={12} color={c.muted}>Sat 24 Oct · Seat G6</T>
        </View>
      </View>
      <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20, padding: 16, gap: 12 }}>
        <Field label="Friend's name" height={48} placeholder="Their full name" autoComplete="name" value={name} onChangeText={setName} />
        <Field label="Email or phone" height={48} placeholder="friend@email.com or 77 123 4567" autoCapitalize="none" keyboardType="email-address" value={contact} onChangeText={setContact} />
        <Tap accessibilityRole="button" style={{ alignSelf: 'flex-start', minHeight: 36, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="userPlus" size={16} color={c.blue} stroke={2.2} />
          <T w={800} s={14} color={c.blue}>Pick from contacts</T>
        </Tap>
      </View>
      <Callout icon="alert" tone="warn" iconSize={18}>
        <T s={13} lh={1.5} color={c.timerInk}>Once they accept, the ticket moves to their account. You can cancel the transfer until then.</T>
      </Callout>
      {error ? <T s={13} color={c.error} accessibilityRole="alert">{error}</T> : null}
      <PrimaryButton label="Send ticket" onPress={() => (contact.trim() ? setSent(true) : setError("Enter your friend's email or phone."))} style={{ marginTop: 'auto' }} />
    </SettingsScreen>
  );
}
