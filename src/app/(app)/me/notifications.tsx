import { useState } from 'react';
import { View } from 'react-native';

import { defaultNotifications, notificationGroups } from '@/mocks/account';
import { useSession } from '@/providers/session';
import { Eyebrow } from '@/ui/components';
import { ListCard, ListRow, SettingsScreen, Toggle } from '@/ui/settings';
import { Display } from '@/ui/Text';

/** E6 Notification settings. */
export default function NotificationSettings() {
  const { user } = useSession();
  const [on, setOn] = useState(defaultNotifications);

  return (
    <SettingsScreen>
      <Display>Notifications.</Display>
      {notificationGroups.map(group => (
        <View key={group.title} style={{ gap: 10 }}>
          <Eyebrow>{group.title}</Eyebrow>
          <ListCard>
            {group.items.map((item, i) => (
              <ListRow
                key={item.id}
                title={item.label}
                sub={item.sub.replace('{email}', user?.email ?? 'ramesh@example.com')}
                last={i === group.items.length - 1}
                trailing={<Toggle label={item.label} value={on[item.id]} locked={item.locked} onChange={v => setOn(s => ({ ...s, [item.id]: v }))} />}
              />
            ))}
          </ListCard>
        </View>
      ))}
    </SettingsScreen>
  );
}
