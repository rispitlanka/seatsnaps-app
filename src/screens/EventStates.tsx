import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { img } from '@/ui/assets';
import { Eyebrow, Footer, OutlineButton, PrimaryButton, Tap, TextButton, useBottomPad } from '@/ui/components';
import { Callout, SheetBody, StatusHero, StepDot } from '@/ui/states';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

function HeroPill({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <View style={{ height: 30, paddingHorizontal: 14, borderRadius: 999, backgroundColor: bg, justifyContent: 'center' }}>
      <T w={800} s={13} ls={0.06} color={fg}>{label}</T>
    </View>
  );
}

/** I6 Sold out + waitlist. */
export function SoldOut() {
  const [waiting, setWaiting] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: c.page }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StatusHero source={img.crowd} alt="Concert crowd" height={280} gray={0.5} pill={<HeroPill label="SOLD OUT" bg={c.ink} fg={c.white} />} />
        <SheetBody>
          <Display>Colombo Jazz <Hl>Nights</Hl></Display>
          <View style={{ gap: 4 }}>
            <T s={14} color={c.ink2}><T w={700} s={14}>Fri 30 Oct</T> · 8:00 PM – 11:00 PM</T>
            <T s={14} color={c.ink2}><T w={700} s={14}>Galle Face</T> · Colombo 01</T>
          </View>
          {waiting ? (
            <Callout icon="check" tone="info" iconSize={22}>
              <T w={800} s={15} color={c.blueDeep}>You&apos;re on the waitlist · #14</T>
              <T s={13} lh={1.5} color={c.blueDeep}>If seats open up we&apos;ll notify you and hold them for 30 minutes.</T>
            </Callout>
          ) : (
            <Callout icon="info" tone="neutral" iconSize={22}>
              <T s={13} lh={1.5} color={c.ink2}>All tickets are gone. Join the waitlist — cancelled and returned tickets go to the waitlist first.</T>
            </Callout>
          )}
          <View style={{ gap: 10 }}>
            <Eyebrow>SIMILAR, STILL AVAILABLE</Eyebrow>
            <Tap accessibilityRole="button" accessibilityLabel="Late-Night Jazz Lounge" onPress={() => router.push({ pathname: '/event/[id]', params: { id: 'late-night-jazz-lounge' } })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, borderWidth: 1, borderColor: c.line, borderRadius: 18 }}>
              <Image source={img.concert} style={{ width: 60, height: 60, borderRadius: 12 }} />
              <View style={{ flex: 1, gap: 2 }}>
                <T w={800} s={12} color={c.blue}>Sat 17 Oct · 9:00 PM</T>
                <T w={800} s={15}>Late-Night Jazz Lounge</T>
              </View>
              <T w={800} s={14} style={{ paddingRight: 8 }}>LKR 3,500</T>
            </Tap>
          </View>
        </SheetBody>
      </ScrollView>
      <Footer>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ gap: 2 }}>
            <T s={12} color={c.muted}>Status</T>
            <T w={800} s={18}>Sold out</T>
          </View>
          <Tap
            accessibilityRole="button"
            onPress={() => setWaiting(w => !w)}
            style={{ flex: 1, height: 54, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: waiting ? c.white : c.ink, borderWidth: waiting ? 1 : 0, borderColor: c.line }}
          >
            <T w={700} s={16} color={waiting ? c.ink : c.white}>{waiting ? 'Leave waitlist' : 'Join waitlist'}</T>
          </Tap>
        </View>
      </Footer>
    </View>
  );
}

/** I7 Event cancelled. */
export function Cancelled() {
  const bottom = useBottomPad();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.page }} contentContainerStyle={{ flexGrow: 1 }}>
      <StatusHero source={img.crowd} height={240} gray={1} dim={0.6} />
      <SheetBody pb={bottom}>
        <View accessibilityRole="alert">
          <Callout icon="xCircle" tone="error" iconSize={22}>
            <T w={800} s={15} color={c.error}>This event has been cancelled</T>
            <T s={13} lh={1.5} color={c.errorDeep}>The organiser cancelled on Wed 14 Oct. Reason: [organiser&apos;s message].</T>
          </Callout>
        </View>
        <T w={800} s={28} lh={1.05} ls={-0.03} upper color={c.muted} style={{ textDecorationLine: 'line-through' }}>Sunday Sessions</T>
        <T s={14} color={c.muted}>Was: Sun 18 Oct · 5:30 PM · Mount Lavinia</T>

        <View style={{ borderWidth: 1, borderColor: c.line, borderRadius: 20, padding: 16, gap: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <T w={800} s={15}>Your refund</T>
            <T w={800} s={18}>LKR 5,150</T>
          </View>
          <T s={13} color={c.ink2}>Full amount including booking fee, back to Card •••• [last 4].</T>
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <StepDot state="done" size={22} />
              <T s={14}><T w={700} s={14}>Refund started</T> · 14 Oct</T>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <StepDot state="current" size={22} />
              <T s={14} style={{ flex: 1 }}><T w={700} s={14}>With your bank</T> · usually 5–7 working days</T>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <StepDot state="todo" size={22} />
              <T s={14} color={c.subtle}>Refund received</T>
            </View>
          </View>
        </View>

        <T s={13} lh={1.5} color={c.ink2}>Your tickets for this event are no longer valid. No action needed from you.</T>

        <View style={{ marginTop: 'auto', gap: 8 }}>
          <PrimaryButton label="See other events by this organiser" onPress={() => router.push({ pathname: '/explore/organiser/[id]', params: { id: 'island-sound-co' } })} />
          <TextButton label="Questions about your refund?" color={c.blue} s={14} onPress={() => router.push('/contact')} />
        </View>
      </SheetBody>
    </ScrollView>
  );
}

/** I8 Event postponed. */
export function Postponed() {
  const bottom = useBottomPad();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.page }} contentContainerStyle={{ flexGrow: 1 }}>
      <StatusHero source={img.comedy} alt="Comedy stage" height={240} pill={<HeroPill label="POSTPONED" bg={c.timerBg} fg={c.timerInk} />} />
      <SheetBody pb={bottom}>
        <Display>Stand-up <Hl>Saturdays</Hl></Display>

        <View style={{ borderWidth: 2, borderColor: c.warnLine, backgroundColor: c.warnSoft, borderRadius: 20, padding: 16, gap: 12 }}>
          <Eyebrow color={c.timerInk}>NEW DATE</Eyebrow>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 56, height: 60, borderRadius: 14, backgroundColor: c.ink, alignItems: 'center', justifyContent: 'center' }}>
              <T w={800} s={10} color={c.periwinkle}>NOV</T>
              <T w={800} s={24} lh={1} color={c.white}>07</T>
              <T w={700} s={9} color={c.onDarkMuted}>SAT</T>
            </View>
            <View style={{ gap: 3 }}>
              <T w={800} s={16}>Sat 7 Nov · 8:30 PM</T>
              <T s={13} color={c.muted}><T s={13} color={c.muted} style={{ textDecorationLine: 'line-through' }}>Sat 17 Oct · 8:00 PM</T> · same venue</T>
            </View>
          </View>
        </View>

        <Callout icon="check" tone="success">
          <T s={14} lh={1.5} color={c.successDeep}><T w={700} s={14} color={c.successDeep}>Your 2 tickets are valid for the new date.</T> Same seats, nothing to do.</T>
        </Callout>

        <T s={13} lh={1.5} color={c.ink2}>Can&apos;t make the new date? You can request a full refund until <T w={700} s={13}>Sat 31 Oct</T>.</T>

        <View style={{ marginTop: 'auto', gap: 10 }}>
          <PrimaryButton label="Keep my tickets" onPress={() => router.push({ pathname: '/me/booking/[id]', params: { id: 'ss-2410' } })} />
          <OutlineButton label="Request a refund" s={16} height={56} onPress={() => router.push('/me/booking/refund')} />
          <TextButton label="Update my calendar" color={c.blue} s={14} height={40} />
        </View>
      </SheetBody>
    </ScrollView>
  );
}
