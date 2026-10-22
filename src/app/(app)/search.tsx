import { useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { browseLinks, recentSearches, trending } from '@/mocks/catalog';
import { Eyebrow, Tap, goBack, inputText, useTopPad } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { T } from '@/ui/Text';
import { c } from '@/ui/tokens';

const showResults = (q: string) => router.push({ pathname: '/results', params: { q } });

function browse(label: string) {
  if (label === 'Organisers' || label === 'Venues') router.navigate({ pathname: '/explore', params: { tab: label } });
  else if (label === 'Free events') showResults('free');
  else router.push({ pathname: '/explore/category/[slug]', params: { slug: label.toLowerCase() } });
}

/** C6 Search. */
export default function Search() {
  const top = useTopPad();
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState(recentSearches);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.white }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: top, paddingHorizontal: 20, paddingBottom: 30, gap: 26 }}>
      <StatusBar style="dark" />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1, height: 52, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 2, borderColor: c.blue, borderRadius: 16 }}>
          <Icon name="search" size={18} color={c.blue} stroke={2.2} />
          <TextInput
            autoFocus
            accessibilityLabel="Search"
            placeholder="Events, artists, venues, organisers"
            placeholderTextColor={c.subtle}
            returnKeyType="search"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => query.trim() && showResults(query.trim())}
            style={[inputText, { flex: 1, height: '100%' }]}
          />
        </View>
        <Tap accessibilityRole="button" onPress={() => goBack()} style={{ minHeight: 44, justifyContent: 'center' }}>
          <T w={700} s={15} color={c.blue}>Cancel</T>
        </Tap>
      </View>

      {recent.length ? (
        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <Eyebrow>RECENT</Eyebrow>
            <Tap accessibilityRole="button" onPress={() => setRecent([])}>
              <T w={700} s={13} color={c.blue}>Clear all</T>
            </Tap>
          </View>
          {recent.map(r => (
            <View key={r} style={{ minHeight: 49, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: c.lineSoft }}>
              <Icon name="recent" size={18} color={c.subtle} />
              <Tap accessibilityRole="link" onPress={() => showResults(r)} style={{ flex: 1, minHeight: 48, justifyContent: 'center' }}>
                <T w={600} s={15}>{r}</T>
              </Tap>
              <Tap accessibilityRole="button" accessibilityLabel={`Remove ${r}`} onPress={() => setRecent(list => list.filter(x => x !== r))} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="close" size={16} color={c.subtle} stroke={2.2} />
              </Tap>
            </View>
          ))}
        </View>
      ) : null}

      <View style={{ gap: 6 }}>
        <Eyebrow>TRENDING IN COLOMBO</Eyebrow>
        {trending.map(t => (
          <Tap key={t.n} accessibilityRole="link" accessibilityLabel={t.q} onPress={() => showResults(t.q)} style={{ minHeight: 53, flexDirection: 'row', alignItems: 'center', gap: 14, borderBottomWidth: 1, borderBottomColor: c.lineSoft }}>
            <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: c.blueSoft, alignItems: 'center', justifyContent: 'center' }}>
              <T w={800} s={13} color={c.blueDeep}>{t.n}</T>
            </View>
            <View style={{ flex: 1, gap: 1 }}>
              <T w={700} s={15}>{t.q}</T>
              <T s={12} color={c.muted}>{t.cat}</T>
            </View>
            <Icon name="trending" size={18} color={c.blue} stroke={2.2} />
          </Tap>
        ))}
      </View>

      <View style={{ gap: 12 }}>
        <Eyebrow>BROWSE</Eyebrow>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {browseLinks.map(label => (
            <Tap key={label} accessibilityRole="link" onPress={() => browse(label)} style={{ height: 42, paddingHorizontal: 16, borderRadius: 999, backgroundColor: c.page, borderWidth: 1, borderColor: c.line, justifyContent: 'center' }}>
              <T w={600} s={14}>{label}</T>
            </Tap>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
