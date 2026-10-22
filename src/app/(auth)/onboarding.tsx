import { useRef, type ReactNode } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { img } from '@/ui/assets';
import { Dots, PrimaryButton, Tap, TextButton, QrPattern, Perforation, useBottomPad, useTopPad } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { Display, Hl, T } from '@/ui/Text';
import { c, shadow } from '@/ui/tokens';

const toLogin = () => router.push('/login');

/** B1–B3 onboarding pager. */
export default function Onboarding() {
  const { width } = useWindowDimensions();
  const pager = useRef<ScrollView>(null);
  const go = (i: number) => pager.current?.scrollTo({ x: i * width, animated: true });

  return (
    <View style={{ flex: 1, backgroundColor: c.white }}>
      <StatusBar style="light" />
      <ScrollView
        ref={pager}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        <Page width={width} step={0} hero={<DiscoverArt />} skip watermark={{ right: -150, bottom: -110, size: 420 }}
          title={<>{'Find your\n'}<Hl>night.</Hl></>}
          body="Concerts, festivals, comedy and meetups across Sri Lanka, all in one place."
          footer={<NextRow left="Sign in" onLeft={toLogin} onNext={() => go(1)} />}
        />
        <Page width={width} step={1} hero={<SeatsArt />} skip watermark={{ left: -170, bottom: -120, size: 420 }}
          title={<>{'Pick the\n'}<Hl>perfect seat.</Hl></>}
          body="See the live seat map, choose exactly where you sit, and pay in a few taps."
          footer={<NextRow left="Back" onLeft={() => go(0)} onNext={() => go(2)} />}
        />
        <Page width={width} step={2} hero={<TicketArt />} watermark={{ right: -140, top: 90, size: 380 }}
          title={<>{'Tickets in\n'}<Hl>your pocket.</Hl></>}
          body="No printing, no queues. Scan your code at the gate and walk straight in."
          footer={
            <View style={{ gap: 6 }}>
              <PrimaryButton label="Get started" onPress={() => router.push('/signup')} />
              <TextButton label="I already have an account" onPress={toLogin} />
            </View>
          }
        />
      </ScrollView>
    </View>
  );
}

function Page({
  width,
  step,
  hero,
  skip,
  watermark,
  title,
  body,
  footer,
}: {
  width: number;
  step: number;
  hero: ReactNode;
  skip?: boolean;
  watermark: { left?: number; right?: number; top?: number; bottom?: number; size: number };
  title: ReactNode;
  body: string;
  footer: ReactNode;
}) {
  const top = useTopPad();
  const bottom = useBottomPad(34);
  const { size, ...pos } = watermark;
  return (
    <View style={{ width, flex: 1 }}>
      <LinearGradient
        colors={[c.heroTop, c.heroBottom]}
        style={{ height: 448 + top, borderBottomLeftRadius: 36, borderBottomRightRadius: 36, overflow: 'hidden' }}
      >
        <Image source={img.watermark} style={{ position: 'absolute', width: size, height: size, opacity: 0.08, ...pos }} />
        <View style={{ position: 'absolute', top, left: 24, right: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Image source={img.wordmarkWhite} style={{ width: 158, height: 30 }} accessibilityLabel="SeatSnaps" />
          {skip ? (
            <Tap accessibilityRole="button" onPress={toLogin} style={{ height: 44, paddingHorizontal: 8, justifyContent: 'center' }}>
              <T w={700} s={14} color={c.white}>Skip</T>
            </Tap>
          ) : null}
        </View>
        {/* Illustrations are laid out on the board's 390pt canvas, centred on wider screens. */}
        <View style={{ position: 'absolute', top: top - 52, width: 390, height: 500, alignSelf: 'center' }}>{hero}</View>
      </LinearGradient>
      <View style={{ flex: 1, paddingTop: 30, paddingHorizontal: 24, paddingBottom: bottom, gap: 12 }}>
        <Dots count={3} active={step} activeWidth={24} rest={c.dot} />
        <Display style={{ marginTop: 8 }}>{title}</Display>
        <T s={15} lh={1.5} color={c.ink2}>{body}</T>
        <View style={{ marginTop: 'auto' }}>{footer}</View>
      </View>
    </View>
  );
}

function NextRow({ left, onLeft, onNext }: { left: string; onLeft: () => void; onNext: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Tap accessibilityRole="button" onPress={onLeft} style={{ height: 44, justifyContent: 'center' }}>
        <T w={700} s={15} color={c.ink2}>{left}</T>
      </Tap>
      <Tap accessibilityRole="button" accessibilityLabel="Next" onPress={onNext} style={{ width: 64, height: 64, borderRadius: 999, backgroundColor: c.blue, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="arrowRight" size={24} color={c.white} stroke={2.4} />
      </Tap>
    </View>
  );
}

const pill = (label: string, active: boolean) => (
  <View key={label} style={{ height: 30, paddingHorizontal: 12, borderRadius: 999, backgroundColor: active ? c.white : '#3D5FD6', justifyContent: 'center' }}>
    <T w={700} s={12} color={active ? c.ink : c.white}>{label}</T>
  </View>
);

function DiscoverArt() {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 130, height: 330 }}>
      <View style={{ position: 'absolute', left: 70, top: 0, width: 230, backgroundColor: c.white, borderRadius: 20, padding: 10, transform: [{ rotate: '-7deg' }], boxShadow: '0 20px 40px rgba(6,12,40,0.35)' }}>
        <Image source={img.boardGames} style={{ width: '100%', height: 96, borderRadius: 12 }} />
        <View style={{ paddingTop: 10, paddingHorizontal: 4, paddingBottom: 2, gap: 3 }}>
          <T w={800} s={13}>Board Game Hangout 6</T>
          <T s={11} color={c.muted}>Fri 17 Oct · Colombo 07</T>
        </View>
      </View>
      <View style={{ position: 'absolute', left: 92, top: 92, width: 240, backgroundColor: c.white, borderRadius: 20, padding: 10, transform: [{ rotate: '5deg' }], boxShadow: shadow.card }}>
        <View style={{ height: 112, borderRadius: 12, backgroundColor: c.ink, overflow: 'hidden' }}>
          <Image source={img.festivalNight} style={{ position: 'absolute', width: '100%', height: '100%' }} />
          <View style={{ position: 'absolute', top: 8, left: 8, width: 42, paddingVertical: 5, borderRadius: 10, backgroundColor: c.white, alignItems: 'center' }}>
            <T w={700} s={9} color={c.blue}>OCT</T>
            <T w={800} s={17} lh={1}>24</T>
          </View>
        </View>
        <View style={{ paddingTop: 10, paddingHorizontal: 4, paddingBottom: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ gap: 3 }}>
            <T w={800} s={14}>Tamil Fest 2026</T>
            <T s={11} color={c.muted}>Nelum Pokuna · 7:30 PM</T>
          </View>
          <View style={{ height: 26, paddingHorizontal: 10, borderRadius: 999, backgroundColor: c.blue, justifyContent: 'center' }}>
            <T w={700} s={11} color={c.white}>Book</T>
          </View>
        </View>
      </View>
      <View style={{ position: 'absolute', left: 33, top: 300, flexDirection: 'row', gap: 6 }}>
        {pill('Concerts', true)}
        {pill('Festivals', false)}
        {pill('Comedy', false)}
      </View>
    </View>
  );
}

const TAKEN = [1, 2, 5, 9, 15, 20, 26, 27, 33];
const MINE = [16, 17];

function SeatsArt() {
  return (
    <>
      <View style={{ position: 'absolute', left: 45, top: 140, width: 300, backgroundColor: c.white, borderRadius: 24, paddingVertical: 20, paddingHorizontal: 18, alignItems: 'center', gap: 14, boxShadow: shadow.card }}>
        <View style={{ alignItems: 'center', gap: 4 }}>
          <View style={{ width: 170, height: 6, borderBottomLeftRadius: 999, borderBottomRightRadius: 999, backgroundColor: c.blue }} />
          <T w={700} s={9} ls={0.16} color={c.muted}>STAGE</T>
        </View>
        <View style={{ width: 7 * 26 + 6 * 7, flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>
          {Array.from({ length: 35 }, (_, i) => (
            <View
              key={i}
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                backgroundColor: MINE.includes(i) ? c.blue : TAKEN.includes(i) ? c.dot : c.white,
                borderWidth: MINE.includes(i) || TAKEN.includes(i) ? 0 : 1.5,
                borderColor: c.seatLine,
              }}
            />
          ))}
        </View>
      </View>
      <View style={{ position: 'absolute', left: 196, top: 336, backgroundColor: c.ink, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10, boxShadow: '0 16px 32px rgba(6,12,40,0.45)' }}>
        <View style={{ width: 32, height: 32, borderRadius: 999, backgroundColor: c.blue, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={16} color={c.white} stroke={2.8} />
        </View>
        <View style={{ gap: 1 }}>
          <T w={800} s={13} color={c.white}>C3, C4</T>
          <T s={11} color={c.onDarkMuted}>2 seats held</T>
        </View>
      </View>
    </>
  );
}

function TicketArt() {
  return (
    <>
      <View style={{ position: 'absolute', left: 70, top: 130, width: 250, backgroundColor: c.white, borderRadius: 22, overflow: 'hidden', transform: [{ rotate: '-4deg' }], boxShadow: shadow.card }}>
        <View style={{ paddingTop: 16, paddingHorizontal: 18, paddingBottom: 12, gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Image source={img.appIcon} style={{ width: 30, height: 30 }} />
            <T w={700} s={10} ls={0.12} color={c.muted}>E-TICKET</T>
          </View>
          <View style={{ gap: 2 }}>
            <T w={800} s={16} ls={-0.01}>Tamil Fest 2026</T>
            <T s={11} color={c.muted}>Sat 24 Oct · Seats D4, D5</T>
          </View>
        </View>
        <Perforation notch={18} inset={16} bg="#233A96" />
        <View style={{ paddingTop: 12, paddingHorizontal: 18, paddingBottom: 18, alignItems: 'center' }}>
          <QrPattern n={15} size={120} seed={11} />
        </View>
      </View>
      <View style={{ position: 'absolute', left: 198, top: 379, backgroundColor: c.white, borderRadius: 16, paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10, boxShadow: '0 16px 32px rgba(6,12,40,0.35)' }}>
        <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: c.ink, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="wallet" size={16} color={c.white} stroke={2.2} />
        </View>
        <T w={800} s={13}>Added to wallet</T>
      </View>
    </>
  );
}
