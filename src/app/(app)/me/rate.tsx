import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';

import { ratingTags, ratingWords } from '@/mocks/extras';
import { img } from '@/ui/assets';
import { Chip, CircleButton, Eyebrow, PrimaryButton, TextButton, goBack, inputText, useBottomPad, useTopPad } from '@/ui/components';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

const STAR = 'm12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2 6.4 20.2l1.1-6.3L2.9 9.5l6.3-.9z';

function Star({ filled, size = 40 }: { filled: boolean; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? c.blue : 'none'} stroke={filled ? c.blue : c.disabled} strokeWidth={1.8} strokeLinejoin="round">
      <Path d={STAR} />
    </Svg>
  );
}

/** L5 Rate the event, with the thank-you state. Ratings aren't submitted to the API yet. */
export default function RateEvent() {
  const top = useTopPad();
  const bottom = useBottomPad();
  const [rating, setRating] = useState(4);
  const [tags, setTags] = useState(['Performers', 'Sound']);
  const [comment, setComment] = useState('');
  const [done, setDone] = useState(false);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.white }}>
      <StatusBar style="light" />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ height: 148 + top, backgroundColor: c.ink }}>
          <Image source={img.festival} style={{ width: '100%', height: '100%' }} />
          <View style={{ position: 'absolute', top, right: 20 }}>
            <CircleButton icon="close" label="Close" variant="solid" onPress={() => goBack()} />
          </View>
        </View>

        {done ? (
          <View style={{ flex: 1, marginTop: -28, backgroundColor: c.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 40, paddingHorizontal: 24, paddingBottom: bottom, alignItems: 'center', gap: 14 }}>
            <View style={{ width: 76, height: 76, borderRadius: 999, backgroundColor: c.blueSoft, alignItems: 'center', justifyContent: 'center' }}>
              <Svg width={36} height={36} viewBox="0 0 24 24" fill={c.blue}>
                <Path d={STAR} />
              </Svg>
            </View>
            <Display>Thanks for <Hl>rating!</Hl></Display>
            <T s={14} lh={1.5} color={c.ink2} align="center">Tamil Arts Circle will see your feedback. Want to know when they announce the next one?</T>
            <View style={{ marginTop: 'auto', width: '100%', gap: 8 }}>
              <PrimaryButton label="Follow Tamil Arts Circle" onPress={() => router.push({ pathname: '/explore/organiser/[id]', params: { id: 'tamil-arts-circle' } })} />
              <TextButton label="Back to home" onPress={() => router.dismissTo('/')} />
            </View>
          </View>
        ) : (
          <View style={{ flex: 1, marginTop: -28, backgroundColor: c.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 24, paddingHorizontal: 20, paddingBottom: bottom, gap: 18 }}>
            <View style={{ gap: 8 }}>
              <T s={13} color={c.muted}>You went to Tamil Fest 2026 · Sat 24 Oct</T>
              <Display>How was <Hl>the night?</Hl></Display>
            </View>
            <View accessibilityRole="radiogroup" accessibilityLabel="Rating" style={{ flexDirection: 'row', gap: 8 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <Pressable key={n} accessibilityRole="radio" accessibilityState={{ checked: n === rating }} accessibilityLabel={`${n} ${n === 1 ? 'star' : 'stars'}`} onPress={() => setRating(n)} style={{ width: 52, height: 52, alignItems: 'center', justifyContent: 'center' }}>
                  <Star filled={n <= rating} />
                </Pressable>
              ))}
            </View>
            <T w={800} s={15} color={c.blue} style={{ minHeight: 20 }}>{ratingWords[rating]}</T>
            <View style={{ gap: 10 }}>
              <Eyebrow>WHAT STOOD OUT?</Eyebrow>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {ratingTags.map(t => (
                  <Chip key={t} label={t} px={14} height={38} active={tags.includes(t)} onPress={() => setTags(list => (list.includes(t) ? list.filter(x => x !== t) : [...list, t]))} />
                ))}
              </View>
            </View>
            <View style={{ gap: 6 }}>
              <T w={600} s={13}>Anything else? <T w={500} s={13} color={c.muted}>(optional, shared with the organiser)</T></T>
              <TextInput
                accessibilityLabel="Anything else? Optional, shared with the organiser"
                multiline
                placeholder="Tell them what you loved or what could be better"
                placeholderTextColor={c.subtle}
                value={comment}
                onChangeText={setComment}
                textAlignVertical="top"
                style={[inputText, { minHeight: 92, paddingVertical: 12, paddingHorizontal: 14, lineHeight: 22, backgroundColor: c.field, borderWidth: 1, borderColor: c.line, borderRadius: 14 }]}
              />
            </View>
            <PrimaryButton label="Send rating" onPress={() => setDone(true)} style={{ marginTop: 'auto' }} />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
