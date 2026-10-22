import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { contactTopics } from '@/mocks/support';
import { useSession } from '@/providers/session';
import { img } from '@/ui/assets';
import { Chip, PrimaryButton, Tap, inputText } from '@/ui/components';
import { Icon, type IconName } from '@/ui/Icon';
import { SettingsScreen } from '@/ui/settings';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

const channels: { label: string; icon: IconName }[] = [
  { label: 'Chat', icon: 'chat' },
  { label: 'Email', icon: 'mail' },
  { label: 'Call', icon: 'call' },
];

/** J6 Contact support. Messages aren't submitted to a support service yet. */
export default function Contact() {
  const { user } = useSession();
  const [topic, setTopic] = useState('Refund');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  return (
    <SettingsScreen>
      <Display>Contact <Hl>us.</Hl></Display>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        {channels.map(ch => (
          <Tap key={ch.label} accessibilityRole="button" style={{ flex: 1, height: 78, borderRadius: 18, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Icon name={ch.icon} size={20} color={c.blue} />
            <T w={700} s={12}>{ch.label}</T>
          </Tap>
        ))}
      </View>

      <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 22, padding: 16, gap: 14 }}>
        <T w={800} s={15}>Or send us a message</T>
        <View style={{ gap: 8 }}>
          <T w={600} s={13}>Topic</T>
          <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {contactTopics.map(t => (
              <Chip key={t} label={t} px={14} height={38} active={topic === t} onPress={() => setTopic(t)} />
            ))}
          </View>
        </View>
        <View style={{ gap: 6 }}>
          <T w={600} s={13}>Booking</T>
          <Tap accessibilityRole="button" style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: c.field, borderWidth: 1, borderColor: c.line, borderRadius: 14 }}>
            <Image source={img.festival} style={{ width: 36, height: 36, borderRadius: 10 }} />
            <T w={700} s={14} style={{ flex: 1 }}>Tamil Fest 2026 · SS-2410-[ID]</T>
            <Icon name="chevronDown" size={16} color={c.muted} stroke={2.4} />
          </Tap>
        </View>
        <View style={{ gap: 6 }}>
          <T w={600} s={13}>Message</T>
          <TextInput
            accessibilityLabel="Message"
            multiline
            placeholder="Tell us what happened…"
            placeholderTextColor={c.subtle}
            value={message}
            onChangeText={setMessage}
            textAlignVertical="top"
            style={[inputText, { minHeight: 138, paddingVertical: 12, paddingHorizontal: 14, lineHeight: 22, backgroundColor: c.field, borderWidth: 1, borderColor: c.line, borderRadius: 14 }]}
          />
        </View>
        <Tap accessibilityRole="button" style={{ alignSelf: 'flex-start', minHeight: 36, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="clip" size={16} color={c.blue} stroke={2.2} />
          <T w={800} s={14} color={c.blue}>Attach a screenshot</T>
        </Tap>
      </View>

      <View style={{ marginTop: 'auto', gap: 18 }}>
        {error ? <T s={13} color={c.error} accessibilityRole="alert" align="center">{error}</T> : null}
        <PrimaryButton label="Send message" onPress={() => (message.trim() ? router.back() : setError('Write a message so we know how to help.'))} />
        <T s={12} color={c.muted} align="center">We reply by email to {user?.email ?? 'ramesh@example.com'}</T>
      </View>
    </SettingsScreen>
  );
}
