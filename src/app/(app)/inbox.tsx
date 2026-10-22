import { useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams, type Href } from 'expo-router';

import { inbox, inboxIcon, type InboxItem } from '@/mocks/support';
import { BackButton, CircleButton, Eyebrow, Tap } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { SettingsScreen } from '@/ui/settings';
import { EmptyState } from '@/ui/states';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

const tone: Record<InboxItem['kind'], [string, string]> = {
  alert: [c.timerBg, c.timerInk],
  tag: [c.successSoft, c.success],
  fire: [c.blueSoft, c.blue],
  ticket: [c.blueSoft, c.blue],
  mic: [c.blueSoft, c.blue],
};

function InboxHeader() {
  return (
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
      <BackButton variant="card" />
      <CircleButton icon="sliders" label="Notification settings" variant="card" iconSize={19} stroke={2} onPress={() => router.push('/me/notifications')} />
    </View>
  );
}

/** H1 Notifications inbox; L8 when there's nothing (sample data always has items — preview with /inbox?empty=1). */
export default function Inbox() {
  const { empty } = useLocalSearchParams<{ empty?: string }>();
  const [allRead, setAllRead] = useState(false);
  const groups = empty ? [] : inbox;

  if (!groups.length) {
    return (
      <SettingsScreen back={<InboxHeader />}>
        <Display>Inbox<Hl>.</Hl></Display>
        <EmptyState
          outline
          art={
            <View style={{ width: 110, height: 110, borderRadius: 999, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="bell" size={44} color={c.blue} stroke={1.8} />
              <View style={{ position: 'absolute', top: 12, right: 10, height: 24, paddingHorizontal: 8, borderRadius: 999, backgroundColor: c.blueSoft, justifyContent: 'center' }}>
                <T w={800} s={11} color={c.blueDeep}>0</T>
              </View>
            </View>
          }
          title="You're all caught up"
          body="Reminders, booking updates and offers will show up here."
          action="Follow organisers for updates"
          onAction={() => router.navigate({ pathname: '/explore', params: { tab: 'Organisers' } })}
        />
      </SettingsScreen>
    );
  }

  return (
    <SettingsScreen back={<InboxHeader />}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <Display>Inbox<Hl>.</Hl></Display>
        <Tap accessibilityRole="button" onPress={() => setAllRead(true)} style={{ minHeight: 36, justifyContent: 'center' }}>
          <T w={700} s={14} color={c.blue}>{allRead ? 'All read' : 'Mark all read'}</T>
        </Tap>
      </View>

      {groups.map(group => (
        <View key={group.title} style={{ gap: 10 }}>
          <Eyebrow>{group.title}</Eyebrow>
          {group.items.map(n => {
            const unread = n.unread && !allRead;
            const [bg, ink] = tone[n.kind];
            return (
              <Tap
                key={n.title}
                accessibilityRole="button"
                accessibilityLabel={`${unread ? 'Unread. ' : ''}${n.title}. ${n.body}`}
                onPress={() => router.push(n.href as Href)}
                style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 12, borderRadius: 18, borderWidth: 1, borderColor: unread ? c.blueSoftLine : c.line, backgroundColor: unread ? c.white : c.cardMuted }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={inboxIcon[n.kind]} size={20} color={ink} />
                </View>
                <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                    <T w={800} s={14} style={{ flexShrink: 1 }}>{n.title}</T>
                    <T s={11} color={c.muted}>{n.time}</T>
                  </View>
                  <T s={13} lh={1.45} color={c.ink2}>{n.body}</T>
                </View>
                {unread ? <View style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: c.blue, marginTop: 6 }} /> : null}
              </Tap>
            );
          })}
        </View>
      ))}
    </SettingsScreen>
  );
}
