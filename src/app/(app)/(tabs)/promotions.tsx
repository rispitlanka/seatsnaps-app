import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { earlyBird, partnerDeals, promoChips, promoCodes } from '@/mocks/account';
import { img } from '@/ui/assets';
import { Chip, Rail, SectionHeader, Tap, useTopPad } from '@/ui/components';
import { Chevron } from '@/ui/settings';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** F1 Promotions tab. */
export default function Promotions() {
  const top = useTopPad();
  const [chip, setChip] = useState('All');
  const [copied, setCopied] = useState('');

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.page }} contentContainerStyle={{ paddingTop: top, paddingBottom: 28, gap: 22 }}>
      <StatusBar style="dark" />
      <View style={{ paddingHorizontal: 20, gap: 8 }}>
        <Display>Promo<Hl>tions.</Hl></Display>
        <T s={14} lh={1.5} color={c.ink2}>Codes, early-bird prices and deals on events near you.</T>
      </View>

      <Rail gap={8}>
        {promoChips.map(label => (
          <Chip key={label} label={label} active={chip === label} onPress={() => setChip(label)} />
        ))}
      </Rail>

      <Tap accessibilityRole="button" accessibilityLabel="LKR 1,000 off Tamil Fest 2026, view offer" onPress={() => router.push({ pathname: '/promo/[id]', params: { id: 'earlybird' } })} style={{ marginHorizontal: 20, borderRadius: 26, overflow: 'hidden' }}>
        <LinearGradient colors={[c.heroTop, c.ink]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Image source={img.watermark} style={{ position: 'absolute', width: 240, height: 240, right: -70, top: -50, opacity: 0.12 }} />
          <View style={{ padding: 22, gap: 10 }}>
            <View style={{ alignSelf: 'flex-start', height: 26, paddingHorizontal: 10, borderRadius: 999, backgroundColor: c.white, justifyContent: 'center' }}>
              <T w={800} s={11} ls={0.08}>EARLY BIRD · ENDS SUN</T>
            </View>
            <Display size={30} color={c.white} accent={c.blueSoftLine}>{'LKR 1,000 off\n'}<Hl>Tamil Fest 2026</Hl></Display>
            <T s={13} color={c.onDark}>On Gold and VIP tickets, 2 or more per order.</T>
          </View>
          <View style={{ marginHorizontal: 14, marginBottom: 14, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.12)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ gap: 2 }}>
              <T s={11} color={c.blueSoftLine}>Use code</T>
              <T w={800} s={18} ls={0.12} color={c.white}>EARLYBIRD</T>
            </View>
            <View style={{ height: 40, paddingHorizontal: 16, borderRadius: 999, backgroundColor: c.white, justifyContent: 'center' }}>
              <T w={800} s={14}>View offer</T>
            </View>
          </View>
        </LinearGradient>
      </Tap>

      <View style={{ paddingHorizontal: 20, gap: 12 }}>
        <Display size={18}>Your <Hl>codes</Hl></Display>
        {promoCodes.map(code => {
          const done = copied === code.code;
          return (
            <View key={code.code} style={{ flexDirection: 'row', backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20, overflow: 'hidden' }}>
              <View style={{ width: 92, backgroundColor: code.bg, alignItems: 'center', justifyContent: 'center', gap: 2, paddingVertical: 12, paddingHorizontal: 6 }}>
                <T w={800} s={22} lh={1} color={code.fg}>{code.big}</T>
                <T w={800} s={11} ls={0.08} color={code.fg} align="center">{code.small}</T>
              </View>
              {/* 2px dashed divider; RN can't dash a single border side on iOS. */}
              <View style={{ width: 2, overflow: 'hidden' }}>
                <View style={{ position: 'absolute', top: 0, left: 0, gap: 6 }}>
                  {Array.from({ length: 20 }, (_, i) => <View key={i} style={{ width: 2, height: 6, backgroundColor: c.line }} />)}
                </View>
              </View>
              <View style={{ flex: 1, minWidth: 0, paddingVertical: 12, paddingHorizontal: 14, gap: 6 }}>
                <T w={800} s={14}>{code.title}</T>
                <T s={12} color={c.muted}>{code.terms}</T>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <T w={800} s={13} ls={0.1} color={c.blueDeep}>{code.code}</T>
                  <Tap accessibilityRole="button" accessibilityLabel={`Copy code ${code.code}`} onPress={() => setCopied(code.code)} style={{ height: 32, paddingHorizontal: 14, borderRadius: 999, justifyContent: 'center', backgroundColor: done ? c.successSoft : c.ink }}>
                    <T w={800} s={12} color={done ? c.success : c.white}>{done ? 'Copied' : 'Copy'}</T>
                  </Tap>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <View style={{ gap: 12 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <SectionHeader action="See all">
            <Display size={18}>Early-bird <Hl>prices</Hl></Display>
          </SectionHeader>
        </View>
        <Rail>
          {earlyBird.map(e => (
            <Tap key={e.id} accessibilityRole="button" accessibilityLabel={e.name} onPress={() => router.push({ pathname: '/event/[id]', params: { id: e.id } })} style={{ width: 210, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20, padding: 8, gap: 10 }}>
              <View style={{ height: 110, borderRadius: 14, overflow: 'hidden' }}>
                <Image source={e.img} style={{ width: '100%', height: '100%' }} />
                <View style={{ position: 'absolute', top: 8, left: 8, height: 26, paddingHorizontal: 10, borderRadius: 999, backgroundColor: c.blue, justifyContent: 'center' }}>
                  <T w={800} s={11} color={c.white}>{e.save}</T>
                </View>
              </View>
              <View style={{ paddingHorizontal: 6, paddingBottom: 6, gap: 4 }}>
                <T w={700} s={12} color={c.muted}>{e.date}</T>
                <T w={800} s={14}>{e.name}</T>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
                  <T w={800} s={15} color={c.blue}>{e.now}</T>
                  <T s={12} color={c.subtle} style={{ textDecorationLine: 'line-through' }}>{e.was}</T>
                </View>
              </View>
            </Tap>
          ))}
        </Rail>
      </View>

      <View style={{ paddingHorizontal: 20, gap: 12 }}>
        <Display size={18}>Partner <Hl>deals</Hl></Display>
        {partnerDeals.map(p => (
          <View key={p.title} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 18 }}>
            <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: c.ink, alignItems: 'center', justifyContent: 'center' }}>
              <T w={800} s={11} color={c.white}>LOGO</T>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <T w={800} s={14}>{p.title}</T>
              <T s={12} color={c.muted}>{p.sub}</T>
            </View>
            <Chevron />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
