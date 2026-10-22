import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useSession } from '@/providers/session';
import { img } from '@/ui/assets';
import { BackButton, Checkbox, Eyebrow, Field, Footer, PrimaryButton, TextButton, useBottomPad, useTopPad } from '@/ui/components';
import { QtyStepper, ResultBadge } from '@/ui/states';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** I2 Free RSVP, with the reserved confirmation state. */
export default function Rsvp() {
  const { user } = useSession();
  const top = useTopPad();
  const bottom = useBottomPad();
  const [spots, setSpots] = useState(1);
  const [share, setShare] = useState(true);
  const [done, setDone] = useState(false);
  const [name, setName] = useState([user?.firstName, user?.lastName].filter(Boolean).join(' '));

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.page }}>
      <StatusBar style="dark" />
      <View style={{ backgroundColor: c.white, paddingTop: top, paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: c.line, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <BackButton />
        <Image source={img.expo} style={{ width: 44, height: 44, borderRadius: 12 }} />
        <View style={{ flex: 1, minWidth: 0, gap: 1 }}>
          <T w={800} s={14} numberOfLines={1}>Intl. Conference on Applied AI &amp; ML</T>
          <T s={12} color={c.muted}>Tue 10 Nov · Thiruvalluvar Cultural Centre, Jaffna</T>
        </View>
      </View>

      {done ? (
        <View style={{ flex: 1, paddingTop: 40, paddingHorizontal: 24, paddingBottom: bottom, alignItems: 'center', gap: 14 }}>
          <ResultBadge icon="check" bg={c.successSoft} color={c.success} iconSize={36} stroke={3} />
          <Display>Spot <Hl>reserved.</Hl></Display>
          <T s={14} lh={1.5} color={c.ink2} align="center">Your free pass is in My tickets. We&apos;ll remind you the day before.</T>
          <View style={{ marginTop: 'auto', width: '100%', gap: 6 }}>
            <PrimaryButton label="View my pass" onPress={() => router.push('/booking/ticket')} />
            <TextButton label="Back to the form" onPress={() => setDone(false)} />
          </View>
        </View>
      ) : (
        <>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: 22, paddingHorizontal: 20, paddingBottom: 20, gap: 16 }}>
            <View style={{ gap: 10 }}>
              <View style={{ alignSelf: 'flex-start', height: 28, paddingHorizontal: 12, borderRadius: 999, backgroundColor: c.successSoft, justifyContent: 'center' }}>
                <T w={800} s={12} color={c.success}>Free entry</T>
              </View>
              <Display>Reserve your <Hl>spot.</Hl></Display>
              <T s={14} lh={1.5} color={c.ink2}>No payment needed. You&apos;ll get a QR pass for entry.</T>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 18 }}>
              <View style={{ gap: 2 }}>
                <T w={800} s={15}>Spots</T>
                <T s={12} color={c.muted}>Up to 2 per person</T>
              </View>
              <QtyStepper qty={spots} min={1} label="spot" onMinus={() => setSpots(n => Math.max(1, n - 1))} onPlus={() => setSpots(n => Math.min(2, n + 1))} />
            </View>

            <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 18, padding: 14, gap: 12 }}>
              <Eyebrow>ATTENDEE</Eyebrow>
              <Field label="Full name" height={48} placeholder="Ramesh Ram" autoComplete="name" value={name} onChangeText={setName} />
              <View style={{ gap: 6 }}>
                <T w={600} s={13}>Organisation <T w={500} s={13} color={c.muted}>(asked by the organiser)</T></T>
                <Field height={48} accessibilityLabel="Organisation" placeholder="University, company…" autoComplete="organization" />
              </View>
              <Checkbox checked={share} onChange={setShare}>
                <T s={13} lh={1.5} color={c.ink2}>Share my name and email with Zenmore Tech for event updates</T>
              </Checkbox>
            </View>
          </ScrollView>
          <Footer>
            <PrimaryButton label={`Reserve ${spots} free ${spots === 1 ? 'spot' : 'spots'}`} onPress={() => setDone(true)} />
          </Footer>
        </>
      )}
    </KeyboardAvoidingView>
  );
}
