import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { promoSteps, promoTerms } from '@/mocks/account';
import { useCart } from '@/providers/cart';
import { img } from '@/ui/assets';
import { BackButton, Footer, PrimaryButton, Tap, useTopPad } from '@/ui/components';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

function Label({ children }: { children: string }) {
  return <T w={800} s={11} ls={0.2} color={c.blue}>{children}</T>;
}

/** F2 Promotion detail. */
export default function PromotionDetail() {
  const top = useTopPad();
  const cart = useCart();
  const [copied, setCopied] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: c.page }}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ paddingBottom: 26 }}>
        <View style={{ height: 208 + top, backgroundColor: c.ink }}>
          <Image source={img.festival} accessibilityLabel="Festival crowd under bunting" style={{ width: '100%', height: '100%' }} />
          <View style={{ position: 'absolute', top, left: 20 }}>
            <BackButton variant="solid" />
          </View>
        </View>

        <View style={{ marginTop: -28, backgroundColor: c.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingTop: 24, paddingBottom: 24, gap: 16 }}>
          <View style={{ alignSelf: 'flex-start', height: 28, paddingHorizontal: 12, borderRadius: 999, backgroundColor: c.timerBg, justifyContent: 'center' }}>
            <T w={800} s={12} color={c.timerInk}>Ends Sun 18 Oct, 11:59 PM</T>
          </View>
          <Display>{'LKR 1,000 off\n'}<Hl>Tamil Fest 2026</Hl></Display>
          <T s={14} lh={1.5} color={c.ink2}>Book 2 or more Gold or VIP tickets before Sunday and take LKR 1,000 off your order.</T>
          <View style={{ borderWidth: 2, borderStyle: 'dashed', borderColor: c.periwinkle, borderRadius: 18, paddingVertical: 14, paddingHorizontal: 16, backgroundColor: c.codeBg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ gap: 2 }}>
              <T s={12} color={c.muted}>Promo code</T>
              <T w={800} s={22} ls={0.14} color={c.blueDeep}>EARLYBIRD</T>
            </View>
            <Tap accessibilityRole="button" onPress={() => setCopied(true)} style={{ height: 40, paddingHorizontal: 16, borderRadius: 999, justifyContent: 'center', backgroundColor: copied ? c.successSoft : c.ink }}>
              <T w={800} s={13} color={copied ? c.success : c.white}>{copied ? 'Copied' : 'Copy code'}</T>
            </Tap>
          </View>
        </View>

        <View style={{ paddingTop: 24, paddingHorizontal: 20, gap: 26 }}>
          <View style={{ gap: 12 }}>
            <Label>HOW TO USE IT</Label>
            <View style={{ gap: 10 }}>
              {promoSteps.map((step, i) => (
                <View key={step} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 999, backgroundColor: c.ink, alignItems: 'center', justifyContent: 'center' }}>
                    <T w={800} s={13} color={c.white}>{i + 1}</T>
                  </View>
                  <T s={14}>{step}</T>
                </View>
              ))}
            </View>
          </View>

          <View style={{ gap: 12 }}>
            <Label>WORKS ON</Label>
            <Tap accessibilityRole="button" accessibilityLabel="Tamil Fest 2026" onPress={() => router.push({ pathname: '/event/[id]', params: { id: 'tamil-fest-2026' } })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 18 }}>
              <Image source={img.festival} style={{ width: 72, height: 72, borderRadius: 12 }} />
              <View style={{ flex: 1, gap: 3 }}>
                <T w={800} s={12} color={c.blue}>Sat 24 Oct · 7:30 PM</T>
                <T w={800} s={15}>Tamil Fest 2026</T>
                <T s={12} color={c.muted}>Gold LKR 5,000 · VIP LKR 8,000</T>
              </View>
            </Tap>
          </View>

          <View style={{ gap: 10 }}>
            <Label>TERMS</Label>
            <View style={{ gap: 6 }}>
              {promoTerms.map(term => (
                <View key={term} style={{ flexDirection: 'row', gap: 8, paddingLeft: 4 }}>
                  <T s={13} lh={1.5} color={c.ink2}>•</T>
                  <T s={13} lh={1.5} color={c.ink2} style={{ flex: 1 }}>{term}</T>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <Footer>
        <PrimaryButton
          label="Get tickets with this code"
          onPress={() => {
            cart.setPromo(true);
            router.push({ pathname: '/event/[id]/select', params: { id: 'tamil-fest-2026' } });
          }}
        />
      </Footer>
    </View>
  );
}
