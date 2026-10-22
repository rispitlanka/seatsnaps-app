import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { lkr } from '@/mocks/catalog';
import { refundReasons } from '@/mocks/support';
import { Chip, Eyebrow, PrimaryButton } from '@/ui/components';
import { Icon } from '@/ui/Icon';
import { ListCard, SettingsScreen } from '@/ui/settings';
import { ResultBadge } from '@/ui/states';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';

const SEATS = ['G5', 'G6'];

/** J3 Request refund, with the requested state. Refunds aren't submitted to the API yet. */
export default function RequestRefund() {
  const [sel, setSel] = useState<Record<string, boolean>>({ G5: true, G6: true });
  const [reason, setReason] = useState(refundReasons[0]);
  const [done, setDone] = useState(false);
  const count = SEATS.filter(s => sel[s]).length;
  const amount = lkr(count * 5000);

  if (done) {
    return (
      <SettingsScreen>
        <View style={{ flex: 1, alignItems: 'center', gap: 14, paddingTop: 50 }}>
          <ResultBadge icon="check" bg={c.successSoft} color={c.success} iconSize={36} stroke={3} />
          <Display>Refund <Hl>requested.</Hl></Display>
          <T s={14} lh={1.5} color={c.ink2} align="center">{amount} is on its way back to your card. We&apos;ve emailed you a receipt.</T>
          <View style={{ marginTop: 'auto', width: '100%' }}>
            <PrimaryButton label="Back to my tickets" onPress={() => router.dismissTo('/me/tickets')} />
          </View>
        </View>
      </SettingsScreen>
    );
  }

  return (
    <SettingsScreen>
      <View style={{ gap: 8 }}>
        <Display>Request a <Hl>refund.</Hl></Display>
        <T s={14} lh={1.5} color={c.ink2}>Tamil Fest 2026 · refundable until Thu 22 Oct, 7:30 PM.</T>
      </View>

      <View style={{ gap: 10 }}>
        <Eyebrow>WHICH TICKETS?</Eyebrow>
        <ListCard>
          {SEATS.map((seat, i) => (
            <Pressable
              key={seat}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: !!sel[seat] }}
              onPress={() => setSel(s => ({ ...s, [seat]: !s[seat] }))}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: i === 0 ? 1 : 0, borderBottomColor: c.lineSoft }}
            >
              <View style={{ width: 22, height: 22, borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: sel[seat] ? c.blue : c.white, borderWidth: sel[seat] ? 0 : 1.5, borderColor: '#767676' }}>
                {sel[seat] ? <Icon name="check" size={15} color={c.white} stroke={3} /> : null}
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <T w={800} s={15}>Gold · Seat {seat}</T>
                <T s={12} color={c.muted}>LKR 5,000</T>
              </View>
            </Pressable>
          ))}
        </ListCard>
      </View>

      <View style={{ gap: 10 }}>
        <Eyebrow>REASON</Eyebrow>
        <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {refundReasons.map(r => (
            <Chip key={r} label={r} px={14} active={reason === r} onPress={() => setReason(r)} />
          ))}
        </View>
      </View>

      <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16, gap: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <T s={14} color={c.ink2}>Tickets</T>
          <T w={700} s={14}>{amount}</T>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <T s={14} color={c.ink2}>Booking fee</T>
          <T w={700} s={14} color={c.muted}>Not refundable</T>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 10, borderTopWidth: 1, borderTopColor: c.lineSoft }}>
          <T w={800} s={14}>You&apos;ll get back</T>
          <T w={800} s={18}>{amount}</T>
        </View>
        <T s={12} color={c.muted}>To Card •••• [last 4] · 5–7 working days</T>
      </View>

      <PrimaryButton
        label={`Cancel ${count} ${count === 1 ? 'ticket' : 'tickets'} & refund`}
        disabled={!count}
        onPress={() => setDone(true)}
        style={{ marginTop: 'auto', backgroundColor: count ? c.error : c.disabled }}
      />
    </SettingsScreen>
  );
}
