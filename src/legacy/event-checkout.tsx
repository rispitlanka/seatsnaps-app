import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";

import { ChoiceChips } from "@/components/booking/ChoiceChips";
import { Countdown } from "@/components/booking/Countdown";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { TextField } from "@/components/ui/TextField";
import { createOrder, releaseHold } from "@/lib/api/bookings";
import { getEventById } from "@/lib/api/events";
import { toErrorMessage } from "@/lib/api/errors";
import { fieldOptions } from "@/lib/booking";
import { formatMoney } from "@/lib/event-display";
import { useCountdown } from "@/hooks/useCountdown";
import { useBooking } from "@/providers/booking";
import { useSession } from "@/providers/session";
import { colors, spacing, typography } from "@/theme";
import type { FormResponseInput } from "@/types/booking";
import type { BookingFormField, Event } from "@/types/event";

export default function CheckoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { user } = useSession();
  const { hold, promoCode, setPromoCode, setHold, setPayhere } = useBooking();
  const [event, setEvent] = useState<Event | null>(null);
  const [fullName, setFullName] = useState(
    [user?.firstName, user?.lastName].filter(Boolean).join(" "),
  );
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [answers, setAnswers] = useState<Record<string, string | number | string[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const remainingMs = useCountdown(hold?.expiresAt);
  const orderStarted = useRef(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    void getEventById(id).then(setEvent).catch(() => undefined);
  }, [id]);

  useEffect(() => {
    if (!hold) {
      router.replace({ pathname: "/event/[id]/select", params: { id: id ?? "" } });
    }
  }, [hold, id]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      if (!orderStarted.current && hold) {
        void releaseHold(hold.id).catch(() => undefined);
        setHold(null);
      }
    });
    return unsubscribe;
  }, [hold, navigation, setHold]);

  const fields = useMemo(
    () =>
      [...(event?.booking_form_fields ?? [])]
        .filter((field) => field.type !== "IMAGE")
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [event],
  );

  async function onSubmit() {
    if (!hold) {
      return;
    }
    if (remainingMs <= 0) {
      setError("Your hold expired. Pick tickets again.");
      return;
    }
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError("Name, email, and phone are required.");
      return;
    }

    const formResponses: FormResponseInput[] = [];
    for (const field of fields) {
      let value: FormResponseInput["value"] | undefined = answers[field.id];
      if (field.type === "NUMBER" && value !== undefined && value !== "") {
        value = Number(value);
      }
      const empty =
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "number" && Number.isNaN(value));
      if (field.required && empty) {
        setError(`${field.name} is required.`);
        return;
      }
      if (!empty) {
        formResponses.push({ fieldId: field.id, value });
      }
    }

    setSubmitting(true);
    setError(null);
    try {
      orderStarted.current = true;
      const result = await createOrder({
        holdId: hold.id,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        ...(promoCode.trim() ? { promoCode: promoCode.trim().toUpperCase() } : {}),
        ...(formResponses.length ? { formResponses } : {}),
      });
      setHold(null);
      if (result.payhere) {
        setPayhere(result.payhere);
        router.replace({ pathname: "/pay/[id]", params: { id: result.order.id } });
        return;
      }
      router.replace({ pathname: "/order/[id]", params: { id: result.order.id } });
    } catch (caught) {
      orderStarted.current = false;
      setError(toErrorMessage(caught, "Could not create the order."));
    } finally {
      setSubmitting(false);
    }
  }

  const pricing = hold?.pricing;

  return (
    <Screen edges={["top", "bottom"]} keyboardVerticalOffset={8}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Ionicons name="chevron-back" size={22} color={colors.foreground} />
        <Text style={styles.backLabel}>Checkout</Text>
      </Pressable>
      <Countdown remainingMs={remainingMs} />
      {pricing?.total ? (
        <Text style={styles.total}>{formatMoney(pricing.total)}</Text>
      ) : null}
      {hold?.offer?.promo_code ? (
        <Text style={styles.hint}>Promo {hold.offer.promo_code} applied on hold</Text>
      ) : null}

      {error ? <Banner message={error} /> : null}

      <View style={styles.form}>
        <TextField label="Full name" value={fullName} onChangeText={setFullName} autoCapitalize="words" textContentType="name" />
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
        />
        <TextField
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
        />
        <TextField
          label="Promo code"
          value={promoCode}
          onChangeText={setPromoCode}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        {fields.map((field) => (
          <FieldInput
            key={field.id}
            field={field}
            value={answers[field.id]}
            onChange={(value) => setAnswers((current) => ({ ...current, [field.id]: value }))}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          label={event?.is_free ? "Confirm free tickets" : "Continue to pay"}
          onPress={() => void onSubmit()}
          loading={submitting}
          disabled={remainingMs <= 0}
        />
      </View>
    </Screen>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: BookingFormField;
  value: string | number | string[] | undefined;
  onChange: (value: string | number | string[]) => void;
}) {
  const options = fieldOptions(field.options);
  const type = field.type;

  if (type === "DROPDOWN" || type === "SINGLE_CHOICE") {
    return (
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>
          {field.name}
          {field.required ? " *" : ""}
        </Text>
        <ChoiceChips options={options} value={typeof value === "string" ? value : undefined} onChange={(next) => onChange(String(next))} />
      </View>
    );
  }
  if (type === "CHECKBOX") {
    return (
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>{field.name}</Text>
        <ChoiceChips
          multiple
          options={options}
          value={Array.isArray(value) ? value : []}
          onChange={(next) => onChange(Array.isArray(next) ? next : [String(next)])}
        />
      </View>
    );
  }

  return (
    <TextField
      label={`${field.name}${field.required ? " *" : ""}`}
      value={value === undefined || Array.isArray(value) ? "" : String(value)}
      onChangeText={(text) => onChange(text)}
      keyboardType={type === "NUMBER" ? "number-pad" : type === "PHONE" ? "phone-pad" : type === "EMAIL" ? "email-address" : "default"}
      autoCapitalize={type === "EMAIL" ? "none" : "sentences"}
    />
  );
}

const styles = StyleSheet.create({
  back: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    marginLeft: -spacing.sm,
    marginBottom: spacing.md,
  },
  backLabel: { ...typography.title, color: colors.foreground },
  total: {
    ...typography.display,
    color: colors.foreground,
    fontVariant: ["tabular-nums"],
    marginTop: spacing.sm,
  },
  hint: { ...typography.caption, color: colors.textSubtle, marginBottom: spacing.lg },
  form: { gap: spacing.lg, marginTop: spacing.xl },
  field: { gap: spacing.sm },
  fieldLabel: { ...typography.caption, color: colors.textMuted, fontWeight: "600" },
  footer: { marginTop: "auto", paddingTop: spacing.xxxl },
});
