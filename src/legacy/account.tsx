import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { MenuRow } from "@/components/ui/MenuRow";
import { Screen } from "@/components/ui/Screen";
import { getMe } from "@/lib/api/auth";
import { useSession } from "@/providers/session";
import { colors, radii, spacing, typography } from "@/theme";

function initials(first?: string | null, last?: string | null, email?: string) {
  const fromName = `${first?.[0] ?? ""}${last?.[0] ?? ""}`.trim();
  if (fromName) {
    return fromName.toUpperCase();
  }
  return (email?.[0] ?? "S").toUpperCase();
}

function noticeCopy(notice?: string | string[]) {
  if (notice === "password") {
    return "Password updated on this device.";
  }
  if (notice === "profile") {
    return "Profile saved.";
  }
  return null;
}

export default function AccountScreen() {
  const { user, setUser, signOut } = useSession();
  const params = useLocalSearchParams<{ notice?: string }>();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const notice = noticeCopy(params.notice);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void getMe()
        .then((me) => {
          if (active) {
            setUser(me);
          }
        })
        .catch(() => {
          // Keep cached profile if refresh fails.
        });
      return () => {
        active = false;
      };
    }, [setUser]),
  );

  async function onLogout() {
    setLoggingOut(true);
    try {
      await signOut();
    } finally {
      setLoggingOut(false);
      setConfirmOpen(false);
    }
  }

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "Your account";

  return (
    <Screen edges={["top"]}>
      <Text style={styles.kicker}>Account</Text>
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {initials(user?.firstName, user?.lastName, user?.email)}
          </Text>
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.phone ? <Text style={styles.meta}>{user.phone}</Text> : null}
        </View>
      </View>

      {notice ? <Banner tone="success" message={notice} /> : null}

      <View style={styles.card}>
        <MenuRow
          icon="lock-closed-outline"
          label="Change password"
          onPress={() => router.push("/account/change-password")}
        />
        <MenuRow
          icon="log-out-outline"
          label="Log out"
          last
          onPress={() => setConfirmOpen(true)}
        />
      </View>

      <Button
        label="Edit profile"
        onPress={() => router.push("/account/edit")}
        style={styles.cta}
      />

      <ConfirmDialog
        visible={confirmOpen}
        title="Log out of SeatSnaps?"
        message="You can sign back in anytime with the same email."
        confirmLabel="Log out"
        loading={loggingOut}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => void onLogout()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: spacing.lg,
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accentMuted,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(31, 115, 255, 0.28)",
  },
  avatarText: {
    ...typography.title,
    color: colors.accent,
  },
  heroCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    ...typography.title,
    color: colors.foreground,
  },
  email: {
    ...typography.body,
    color: colors.textMuted,
  },
  meta: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  cta: {
    marginTop: spacing.xl,
  },
});
