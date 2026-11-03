import { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';

import { BookingStatus } from '@/features/booking/BookingStatus';
import { placeHold } from '@/features/booking/place-hold';
import { useBookableEvent } from '@/features/booking/useBookableEvent';
import { createOrder, releaseHold } from '@/lib/api/bookings';
import { toErrorMessage } from '@/lib/api/errors';
import { fieldOptions, quoteHold, selectionFromHold } from '@/lib/booking';
import { eventCoverUrl, formatEventWhen, formatMoney } from '@/lib/event-display';
import { useBooking } from '@/providers/booking';
import { useSession } from '@/providers/session';
import { BookingHeader } from '@/ui/booking';
import { keyboardBehavior } from '@/ui/keyboard';
import { Checkbox, Chip, Eyebrow, Field, Footer, PrimaryButton } from '@/ui/components';
import { Display, Hl, T } from '@/ui/Text';
import { c } from '@/ui/tokens';
import type { FormResponseInput, Hold } from '@/types/booking';
import type { BookingFormField } from '@/types/event';

const PROMO = /^[A-Za-z0-9]{4,12}$/;

function Line({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
      <T s={14} color={color ?? c.ink2} style={{ flex: 1 }}>{label}</T>
      <T w={700} s={14} color={color}>{value}</T>
    </View>
  );
}

/** Buyer details, promo, and PayHere. The hold is released if checkout is abandoned. */
export default function Checkout() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { user } = useSession();
  const { event, error: eventError, loading, reload } = useBookableEvent(id);
  const { hold, setHold, promoCode, setPromoCode, setPayhere, clearSelection } = useBooking();
  const [fullName, setFullName] = useState([user?.firstName, user?.lastName].filter(Boolean).join(' '));
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [answers, setAnswers] = useState<Record<string, string | number | string[]>>({});
  const [draftPromo, setDraftPromo] = useState(promoCode);
  const [promoError, setPromoError] = useState('');
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }
    setFullName((current) => current || [user.firstName, user.lastName].filter(Boolean).join(' '));
    setEmail((current) => current || user.email || '');
    setPhone((current) => current || user.phone || '');
  }, [user]);
  const orderStarted = useRef(false);
  const replacingHold = useRef(false);
  const holdRef = useRef<Hold | null>(hold);
  holdRef.current = hold;

  useEffect(() => {
    const unsubscribe = (navigation as { addListener: (event: 'beforeRemove', listener: () => void) => () => void }).addListener('beforeRemove', () => {
      const current = holdRef.current;
      if (!orderStarted.current && !replacingHold.current && current) {
        void releaseHold(current.id).catch(() => undefined);
      }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (loading || !event || hold || replacingHold.current || orderStarted.current) {
      return;
    }
    router.replace({ pathname: '/event/[id]', params: { id: event.id } });
  }, [event, hold, loading]);

  const fields = useMemo(
    () => [...(event?.booking_form_fields ?? [])].filter((field) => field.type !== 'IMAGE').sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [event],
  );

  if (!event || !hold) {
    return <BookingStatus title="Checkout" loading={loading} error={eventError} onRetry={() => void reload()} />;
  }

  const quote = quoteHold(hold, event);
  const cover = eventCoverUrl(event);
  const applied = hold.offer?.promo_code;
  const totalLabel = formatMoney(String(quote.total)) ?? 'LKR 0';
  const free = event.is_free || quote.total === 0;

  async function replaceHold(nextPromo?: string) {
    const current = holdRef.current;
    if (!current || !event) {
      return;
    }
    const selection = selectionFromHold(current);
    replacingHold.current = true;
    holdRef.current = null;
    setHold(null);
    try {
      await releaseHold(current.id).catch(() => undefined);
      const next = await placeHold({
        eventId: event.id,
        seatIds: selection.seatIds,
        standing: selection.standing,
        promoCode: nextPromo,
      });
      holdRef.current = next;
      setHold(next);
      setPromoCode(nextPromo ?? '');
      setDraftPromo(next.offer?.promo_code ?? nextPromo ?? '');
      setPromoError('');
    } catch (caught) {
      if (nextPromo) {
        try {
          const restored = await placeHold({
            eventId: event.id,
            seatIds: selection.seatIds,
            standing: selection.standing,
          });
          holdRef.current = restored;
          setHold(restored);
          setPromoCode('');
        } catch {
          setError('Your tickets were released. Go back and pick them again.');
        }
      }
      throw caught;
    } finally {
      replacingHold.current = false;
    }
  }

  async function applyPromo() {
    if (applied) {
      setApplying(true);
      setPromoError('');
      try {
        await replaceHold();
      } catch (caught) {
        setPromoError(toErrorMessage(caught, 'Could not remove that promo.'));
      } finally {
        setApplying(false);
      }
      return;
    }
    const code = draftPromo.trim().toUpperCase();
    if (!PROMO.test(code)) {
      setPromoError('Use 4–12 letters or digits.');
      return;
    }
    setApplying(true);
    setPromoError('');
    try {
      await replaceHold(code);
    } catch (caught) {
      setPromoError(toErrorMessage(caught, 'That promo code could not be applied.'));
    } finally {
      setApplying(false);
    }
  }

  function collectResponses() {
    const formResponses: FormResponseInput[] = [];
    for (const field of fields) {
      let value: FormResponseInput['value'] | undefined = answers[field.id];
      if (field.type === 'NUMBER' && value !== undefined && value !== '') {
        value = Number(value);
      }
      const empty = value === undefined || value === '' || (Array.isArray(value) && value.length === 0) || (typeof value === 'number' && Number.isNaN(value));
      if (field.required && empty) {
        throw new Error(`${field.name} is required.`);
      }
      if (!empty && value !== undefined) {
        formResponses.push({ fieldId: field.id, value });
      }
    }
    return formResponses;
  }

  async function onSubmit() {
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError('Name, email, and phone are required.');
      return;
    }
    if (!agreed) {
      setError('Agree to the terms to continue.');
      return;
    }
    let formResponses: FormResponseInput[] = [];
    try {
      formResponses = collectResponses();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Check the questions and try again.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      orderStarted.current = true;
      const result = await createOrder({
        holdId: hold!.id,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        ...(applied ? { promoCode: applied } : {}),
        ...(formResponses.length ? { formResponses } : {}),
      });
      setHold(null);
      clearSelection();
      if (result.payhere) {
        setPayhere(result.payhere);
        router.replace({ pathname: '/pay/[id]', params: { id: result.order.id } });
        return;
      }
      router.replace({ pathname: '/order/[id]', params: { id: result.order.id } });
    } catch (caught) {
      orderStarted.current = false;
      setError(toErrorMessage(caught, 'Could not create the order.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={keyboardBehavior} style={{ flex: 1, backgroundColor: c.page }}>
      <BookingHeader step={hold.kind === 'standing' ? 2 : 3} steps={hold.kind === 'standing' ? ['1 · Tickets', '2 · Checkout'] : undefined} timer title="Checkout" titleSize={17} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: 22, paddingHorizontal: 20, paddingBottom: 26, gap: 24 }}>
        <Display>Almost <Hl>yours.</Hl></Display>
        {error ? <T accessibilityRole="alert" color={c.danger}>{error}</T> : null}

        <View style={{ backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 22, overflow: 'hidden' }}>
          <View style={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: c.lineSoft }}>
            {cover ? <Image source={{ uri: cover }} style={{ width: 56, height: 56, borderRadius: 14 }} /> : null}
            <View style={{ flex: 1, gap: 2 }}>
              <T w={800} s={15}>{event.name}</T>
              <T s={12} color={c.muted}>{formatEventWhen(event.start, event.end)}</T>
              <T s={12} color={c.muted}>{event.venue?.name}</T>
            </View>
          </View>
          <View style={{ paddingVertical: 14, paddingHorizontal: 16, gap: 10 }}>
            <Line label={quote.summary || 'Tickets'} value={formatMoney(String(quote.subtotal)) ?? 'LKR 0'} />
            {quote.discount > 0 ? (
              <Line label={applied ? `Promo · ${applied}` : 'Discount'} value={`− ${formatMoney(String(quote.discount))}`} color={c.success} />
            ) : null}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
              <View style={{ flex: 1 }}>
                <Field
                  accessibilityLabel="Promo code"
                  placeholder="Promo code"
                  autoCapitalize="characters"
                  autoCorrect={false}
                  value={draftPromo}
                  onChangeText={(value) => {
                    setDraftPromo(value.toUpperCase());
                    setPromoError('');
                  }}
                  onSubmitEditing={() => void applyPromo()}
                  editable={!applied}
                  invalid={Boolean(promoError)}
                  background={c.field}
                  height={46}
                />
              </View>
              <PrimaryButton label={applied ? 'Remove' : applying ? 'Applying…' : 'Apply'} disabled={applying} onPress={() => void applyPromo()} style={{ paddingHorizontal: 16 }} />
            </View>
            {promoError ? <T w={700} s={13} color={c.danger} accessibilityRole="alert">{promoError}</T> : null}
          </View>
          <View style={{ paddingVertical: 14, paddingHorizontal: 16, backgroundColor: c.field, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <T w={800} s={15}>Total</T>
            <T w={800} s={22} ls={-0.02}>{totalLabel}</T>
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <Eyebrow>YOUR DETAILS</Eyebrow>
          <Field label="Full name" placeholder="Your name" autoComplete="name" textContentType="name" background={c.white} value={fullName} onChangeText={setFullName} />
          <Field label="Email" placeholder="you@email.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" background={c.white} hint="We'll send your tickets here." value={email} onChangeText={setEmail} />
          <Field label="Phone" placeholder="+94 77 123 4567" keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" background={c.white} hint="Include the country code." value={phone} onChangeText={setPhone} />
          {fields.map((field) => (
            <Question key={field.id} field={field} value={answers[field.id]} onChange={(value) => setAnswers((current) => ({ ...current, [field.id]: value }))} />
          ))}
        </View>

        <Checkbox checked={agreed} onChange={setAgreed}>
          <T s={13} lh={1.5} color={c.ink2}>
            I agree to the <T w={700} s={13} color={c.blue} onPress={() => router.push('/legal')}>Terms</T> and the event&apos;s refund policy.
          </T>
        </Checkbox>
      </ScrollView>
      <Footer gap={10}>
        <PrimaryButton
          icon="lock"
          label={submitting ? 'Placing order…' : free ? 'Confirm tickets' : `Pay ${totalLabel}`}
          disabled={!agreed || submitting || applying}
          onPress={() => void onSubmit()}
        />
        <T s={12} color={c.muted} align="center">{free ? 'Free tickets are issued straight away.' : 'You will pay on PayHere. Tickets are sent after payment.'}</T>
      </Footer>
    </KeyboardAvoidingView>
  );
}

function Question({
  field,
  value,
  onChange,
}: {
  field: BookingFormField;
  value: string | number | string[] | undefined;
  onChange: (value: string | number | string[]) => void;
}) {
  const options = fieldOptions(field.options);
  const label = `${field.name}${field.required ? ' *' : ''}`;
  if (field.type === 'DROPDOWN' || field.type === 'SINGLE_CHOICE' || field.type === 'CHECKBOX') {
    const selected = new Set(Array.isArray(value) ? value : value ? [String(value)] : []);
    return (
      <View style={{ gap: 8 }}>
        <T w={600} s={13}>{label}</T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {options.map((option) => (
            <Chip
              key={option}
              label={option}
              active={selected.has(option)}
              onPress={() => {
                if (field.type === 'CHECKBOX') {
                  const next = new Set(selected);
                  if (next.has(option)) next.delete(option);
                  else next.add(option);
                  onChange([...next]);
                  return;
                }
                onChange(option);
              }}
            />
          ))}
        </View>
      </View>
    );
  }
  return (
    <Field
      label={label}
      background={c.white}
      value={value === undefined || Array.isArray(value) ? '' : String(value)}
      onChangeText={onChange}
      keyboardType={field.type === 'NUMBER' ? 'number-pad' : field.type === 'PHONE' ? 'phone-pad' : field.type === 'EMAIL' ? 'email-address' : 'default'}
      autoCapitalize={field.type === 'EMAIL' ? 'none' : 'sentences'}
    />
  );
}
