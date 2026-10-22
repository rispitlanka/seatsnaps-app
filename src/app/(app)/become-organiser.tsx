import { ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';

import { organiserPerks, organiserSteps } from '@/mocks/support';
import { img } from '@/ui/assets';
import { CircleButton, Eyebrow, PrimaryButton, goBack, useBottomPad, useTopPad } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** J8 Become an organiser. */
export default function BecomeOrganiser() {
  const top = useTopPad();
  const bottom = useBottomPad();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.page }} contentContainerStyle={{ flexGrow: 1 }}>
      <StatusBar style="light" />
      <View style={{ backgroundColor: c.ink, paddingTop: top, paddingHorizontal: 20, paddingBottom: 30, gap: 18, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden' }}>
        <Image source={img.watermark} style={{ position: 'absolute', width: 300, height: 300, right: -110, top: 20, opacity: 0.1 }} />
        <View style={{ flexDirection: 'row' }}>
          <CircleButton icon="chevronLeft" label="Back" variant="glass" onPress={() => goBack()} />
        </View>
        <T w={700} s={11} ls={0.2} color={c.periwinkle}>FOR ORGANISERS</T>
        <Display color={c.white} accent={c.blueBright}>{'Sell out your\n'}<Hl>next night.</Hl></Display>
        <T s={14} lh={1.5} color={c.onDarkMuted}>List events, sell seated or general tickets, and scan guests in at the door.</T>
      </View>

      <View style={{ flex: 1, paddingTop: 24, paddingHorizontal: 20, paddingBottom: bottom, gap: 22 }}>
        <View style={{ gap: 10 }}>
          {organiserPerks.map(p => (
            <View key={p.t} style={{ flexDirection: 'row', gap: 12, padding: 14, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 18 }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: c.blueSoft, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="check" size={18} color={c.blue} stroke={2.6} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <T w={800} s={15}>{p.t}</T>
                <T s={13} lh={1.45} color={c.ink2}>{p.d}</T>
              </View>
            </View>
          ))}
        </View>

        <View style={{ gap: 10 }}>
          <Eyebrow>HOW IT WORKS</Eyebrow>
          {organiserSteps.map((step, i) => (
            <View key={step} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 28, height: 28, borderRadius: 999, backgroundColor: c.ink, alignItems: 'center', justifyContent: 'center' }}>
                <T w={800} s={13} color={c.white}>{i + 1}</T>
              </View>
              <T s={14}>{step}</T>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 'auto', gap: 8 }}>
          <PrimaryButton label="Continue on the web" iconRight="external" />
          <T s={12} color={c.muted} align="center">Event set-up works best on a computer. We&apos;ll sign you in automatically.</T>
        </View>
      </View>
    </ScrollView>
  );
}
