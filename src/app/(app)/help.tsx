import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { faqs, helpTopics } from '@/mocks/support';
import { Eyebrow, Tap, inputText } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { SettingsScreen } from '@/ui/settings';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** J5 Help & FAQ. */
export default function Help() {
  const [open, setOpen] = useState(0);
  const [query, setQuery] = useState('');
  const shown = faqs.filter(([q, a]) => `${q} ${a}`.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <SettingsScreen>
      <Display>How can we <Hl>help?</Hl></Display>
      <View style={{ height: 54, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 16 }}>
        <Icon name="search" size={18} color={c.muted} />
        <TextInput accessibilityLabel="Search help" placeholder="Search help articles" placeholderTextColor={c.subtle} value={query} onChangeText={setQuery} style={[inputText, { flex: 1, height: '100%' }]} />
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {helpTopics.map(t => (
          <Tap key={t.name} accessibilityRole="button" accessibilityLabel={`${t.name}, ${t.n}`} style={{ flexBasis: '40%', flexGrow: 1, padding: 14, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 18, gap: 4 }}>
            <T w={800} s={14}>{t.name}</T>
            <T s={12} color={c.muted}>{t.n}</T>
          </Tap>
        ))}
      </View>

      <View style={{ gap: 10 }}>
        <Eyebrow>POPULAR QUESTIONS</Eyebrow>
        <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20, paddingHorizontal: 16 }}>
          {shown.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <View key={q} style={{ borderBottomWidth: i < shown.length - 1 ? 1 : 0, borderBottomColor: c.lineSoft }}>
                <Tap accessibilityRole="button" accessibilityState={{ expanded: isOpen }} onPress={() => setOpen(isOpen ? -1 : i)} style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <T w={700} s={15} style={{ flex: 1 }}>{q}</T>
                  <View style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}>
                    <Icon name="chevronDown" size={18} color={c.muted} stroke={2.4} />
                  </View>
                </Tap>
                {isOpen ? <T s={14} lh={1.55} color={c.ink2} style={{ marginBottom: 14 }}>{a}</T> : null}
              </View>
            );
          })}
        </View>
      </View>

      <View style={{ backgroundColor: c.ink, borderRadius: 22, padding: 18, gap: 10 }}>
        <T w={800} s={17} color={c.white}>Still stuck?</T>
        <T s={13} lh={1.5} color={c.onDarkMuted}>Our team usually replies within [response time] · [support hours].</T>
        <Tap accessibilityRole="button" onPress={() => router.push('/contact')} style={{ alignSelf: 'flex-start', height: 44, paddingHorizontal: 18, borderRadius: 999, backgroundColor: c.white, justifyContent: 'center' }}>
          <T w={800} s={14}>Contact support</T>
        </Tap>
      </View>
    </SettingsScreen>
  );
}
