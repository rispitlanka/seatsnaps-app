import { View } from "react-native";

import { BookingHeader } from "@/ui/booking";
import { PrimaryButton } from "@/ui/components";
import { SkeletonStack } from "@/ui/skeleton";
import { T } from "@/ui/Text";
import { c } from "@/ui/tokens";

export function BookingStatus({
  title,
  loading,
  error,
  onRetry,
  retryLabel = 'Try again',
}: {
  title: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: c.page }}>
      <BookingHeader step={1} title={title} />
      <View style={{ padding: 20, gap: 12 }}>
        {loading ? <SkeletonStack count={3} height={84} /> : null}
        {error ? (
          <T accessibilityRole="alert" color={c.danger}>
            {error}
          </T>
        ) : null}
        {error && onRetry ? <PrimaryButton label={retryLabel} onPress={onRetry} /> : null}
      </View>
    </View>
  );
}
