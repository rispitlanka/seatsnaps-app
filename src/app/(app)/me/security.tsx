import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import { Eyebrow, Tap } from '@/ui/components';
import { GoogleIcon } from '@/ui/Icon';
import { ListCard, ListRow, RowAction, SettingsScreen, Toggle } from '@/ui/settings';
import { Display, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

/** E8 Security. */
export default function Security() {
  const [twoFa, setTwoFa] = useState(false);

  return (
    <SettingsScreen>
      <Display>Security.</Display>

      <View style={{ gap: 10 }}>
        <Eyebrow>SIGN IN</Eyebrow>
        <ListCard>
          <ListRow
            title="Password"
            sub="Last changed [date]"
            trailing={
              <Tap accessibilityRole="button" onPress={() => router.push('/me/change-password')} style={{ height: 36, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: c.line, justifyContent: 'center' }}>
                <T w={700} s={13}>Change</T>
              </Tap>
            }
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: c.lineSoft }}>
            <GoogleIcon />
            <View style={{ flex: 1 }}>
              <ListRow title="Google" sub="Connected" last trailing={<RowAction label="Disconnect" />} />
            </View>
          </View>
          <ListRow title="Two-step verification" sub={twoFa ? 'On · codes sent by SMS' : 'Off · add a code when you sign in'} last trailing={<Toggle label="Two-step verification" value={twoFa} onChange={setTwoFa} />} />
        </ListCard>
      </View>

      <View style={{ gap: 10 }}>
        <Eyebrow>WHERE YOU&apos;RE SIGNED IN</Eyebrow>
        <ListCard>
          <ListRow title="This phone" sub="Active now" subColor={c.success} subBold icon="phone" />
          <ListRow title="Web browser · Colombo" sub="Last active [time]" icon="monitor" tint="grey" last trailing={<RowAction label="Sign out" color={c.error} />} />
        </ListCard>
        <Tap accessibilityRole="button" style={{ alignSelf: 'flex-start', minHeight: 40, justifyContent: 'center' }}>
          <T w={800} s={14} color={c.blue}>Sign out of all other devices</T>
        </Tap>
      </View>

      <View style={{ marginTop: 'auto', backgroundColor: c.white, borderWidth: 1, borderColor: c.errorLine, borderRadius: 20, padding: 16, gap: 10 }}>
        <T w={800} s={15} color={c.error}>Delete account</T>
        <T s={13} lh={1.5} color={c.ink2}>This removes your profile and saved events. Tickets for upcoming events stay valid until the event ends.</T>
        <Tap accessibilityRole="button" onPress={() => router.push('/delete-account')} style={{ alignSelf: 'flex-start', height: 40, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1, borderColor: c.errorLine, justifyContent: 'center' }}>
          <T w={800} s={13} color={c.error}>Delete my account</T>
        </Tap>
      </View>
    </SettingsScreen>
  );
}
