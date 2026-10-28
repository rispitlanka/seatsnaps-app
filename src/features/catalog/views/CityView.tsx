import { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';


import { usePrefs } from '@/providers/prefs';
import { CircleButton, Eyebrow, Footer, PrimaryButton, Tap, goBack, inputText, useTopPad } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { RadioDot } from '@/ui/settings';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** G6 City picker. */
export default function CityPicker({ cities }: { cities: string[][] }) {
  const top = useTopPad();
  const prefs = usePrefs();
  const [sel, setSel] = useState(prefs.city);
  const [query, setQuery] = useState('');
  const list = cities.filter(([name]) => name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <View style={{ flex: 1, backgroundColor: c.page }}>
      <StatusBar style="dark" />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: top, paddingHorizontal: 20, paddingBottom: 20, gap: 16 }}>
        <View style={{ flexDirection: 'row' }}>
          <CircleButton icon="close" label="Close" variant="card" onPress={() => goBack()} />
        </View>
        <Display>Choose your <Hl>city.</Hl></Display>
        <View style={{ height: 54, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 16 }}>
          <Icon name="search" size={18} color={c.muted} />
          <TextInput accessibilityLabel="Search cities" placeholder="Search cities" placeholderTextColor={c.subtle} value={query} onChangeText={setQuery} style={[inputText, { flex: 1, height: '100%' }]} />
        </View>
        <Tap accessibilityRole="button" onPress={() => router.push('/location')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: c.blueSoft, borderRadius: 16 }}>
          <Icon name="navigate" size={20} color={c.blueDeep} stroke={2.2} />
          <T w={800} s={15} color={c.blueDeep}>Use my current location</T>
        </Tap>

        <View style={{ marginTop: 4 }}>
          <Eyebrow>CITIES WITH EVENTS</Eyebrow>
        </View>
        <View accessibilityRole="radiogroup" style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20, paddingHorizontal: 14 }}>
          {list.map(([name, count], i) => (
            <Pressable
              key={name}
              accessibilityRole="radio"
              accessibilityState={{ checked: name === sel }}
              onPress={() => setSel(name)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, borderBottomWidth: i < list.length - 1 ? 1 : 0, borderBottomColor: c.lineSoft }}
            >
              <View style={{ flex: 1, gap: 1 }}>
                <T w={700} s={15}>{name}</T>
                <T s={12} color={c.muted}>{count}</T>
              </View>
              <RadioDot on={name === sel} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <Footer>
        <PrimaryButton
          label={`Show events in ${sel}`}
          onPress={() => {
            prefs.setCity(sel);
            goBack();
          }}
        />
      </Footer>
    </View>
  );
}
