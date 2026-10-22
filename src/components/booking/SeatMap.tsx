import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from "react-native";
import { Image } from "expo-image";

import { groupSeatsByRow, isCanvasZone } from "@/lib/booking";
import { mediaUrl } from "@/lib/event-display";
import { colors, radii, spacing, typography } from "@/theme";
import type { CanvasObject, EventLayout, EventSeat, EventZone, ZoneTable } from "@/types/event";

const GRID_SEAT = 36;
const MIN_CANVAS_SEAT = 22;

type SeatMapProps = {
  zone: EventZone;
  layout?: EventLayout | null;
  selectedIds: string[];
  onToggle: (seat: EventSeat) => void;
};

export function SeatMap({ zone, layout, selectedIds, onToggle }: SeatMapProps) {
  if (isCanvasZone(zone)) {
    return (
      <CanvasFloor
        zone={zone}
        layout={layout}
        selectedIds={selectedIds}
        onToggle={onToggle}
      />
    );
  }

  return <GridFloor seats={zone.seats ?? []} selectedIds={selectedIds} onToggle={onToggle} />;
}

function GridFloor({
  seats,
  selectedIds,
  onToggle,
}: {
  seats: EventSeat[];
  selectedIds: string[];
  onToggle: (seat: EventSeat) => void;
}) {
  const rows = groupSeatsByRow(seats);

  return (
    <View style={styles.wrap}>
      <View style={styles.stage}>
        <Text style={styles.stageLabel}>Stage</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.grid}>
          {rows.map(([row, rowSeats]) => (
            <View key={row} style={styles.row}>
              <Text style={styles.rowLabel}>{row}</Text>
              {rowSeats.map((seat) => (
                <SeatChip
                  key={seat.id}
                  seat={seat}
                  selected={selectedIds.includes(seat.id)}
                  label={String(seat.column ?? seat.code)}
                  onToggle={onToggle}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      <LegendRow />
    </View>
  );
}

function CanvasFloor({
  zone,
  layout,
  selectedIds,
  onToggle,
}: SeatMapProps) {
  const [boardWidth, setBoardWidth] = useState(320);
  const seats = zone.seats ?? [];
  const objects = useMemo(() => canvasObjectsForZone(zone, layout), [layout, zone]);
  const tables = zone.tables ?? [];
  const background = mediaUrl(layout?.background_image);
  const canvas = {
    width: zone.canvas_width ?? layout?.canvas_width ?? 1000,
    height: zone.canvas_height ?? layout?.canvas_height ?? 700,
  };
  const nativeSeat = zone.seat_spacing_x ?? 40;

  const scale = useMemo(() => {
    const fit = boardWidth / canvas.width;
    const forTaps = MIN_CANVAS_SEAT / nativeSeat;
    return Math.max(fit, forTaps);
  }, [boardWidth, canvas.width, nativeSeat]);

  function onLayout(event: LayoutChangeEvent) {
    const width = event.nativeEvent.layout.width;
    if (width > 0 && Math.abs(width - boardWidth) > 1) {
      setBoardWidth(width);
    }
  }

  const boardW = canvas.width * scale;
  const boardH = canvas.height * scale;

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      <ScrollView
        horizontal
        nestedScrollEnabled
        directionalLockEnabled
        showsHorizontalScrollIndicator={false}
      >
        <View style={[styles.canvasFrame, { width: boardW, height: boardH }]}>
          {background ? (
            <Image
              source={{ uri: background }}
              style={StyleSheet.absoluteFill}
              contentFit="fill"
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.canvasBg]} />
          )}
          {objects.map((object) => (
            <CanvasShape key={object.id} object={object} scale={scale} />
          ))}
          {tables.map((table) => (
            <TableShape key={table.id} table={table} scale={scale} />
          ))}
          {seats.map((seat) => {
            const seatScale = seat.layout?.scale ?? 1;
            const size = nativeSeat * seatScale * scale;
            const x = (seat.layout?.x ?? 0) * scale;
            const y = (seat.layout?.y ?? 0) * scale;
            const rotation = seat.layout?.rotation ?? 0;
            return (
              <View
                key={seat.id}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  transform: [{ rotate: `${rotation}deg` }],
                }}
              >
                <SeatChip
                  seat={seat}
                  selected={selectedIds.includes(seat.id)}
                  label={seat.code}
                  size={size}
                  round
                  accent={zone.color}
                  onToggle={onToggle}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
      {boardW > boardWidth + 8 ? (
        <Text style={styles.canvasHint}>Scroll sideways to see the full floor.</Text>
      ) : null}
      <LegendRow />
    </View>
  );
}

function canvasObjectsForZone(zone: EventZone, layout?: EventLayout | null) {
  if (zone.canvas_objects?.length) {
    return zone.canvas_objects;
  }
  return (layout?.canvas_objects ?? []).filter(
    (object) => !object.zone_id || object.zone_id === zone.id,
  );
}

function canvasFill(object: CanvasObject) {
  const properties = object.properties ?? {};
  for (const key of ["color", "fill", "background"] as const) {
    const value = properties[key];
    if (typeof value === "string" && value) {
      return value;
    }
  }
  return null;
}

function canvasLabel(object: CanvasObject) {
  const properties = object.properties ?? {};
  if (typeof properties.text === "string" && properties.text) {
    return properties.text;
  }
  if (typeof properties.label === "string" && properties.label) {
    return properties.label;
  }
  if (object.object_type === "stage") {
    return "Stage";
  }
  if (object.object_type === "label") {
    return "";
  }
  return object.object_type;
}

function CanvasShape({ object, scale }: { object: CanvasObject; scale: number }) {
  const isStage = object.object_type === "stage";
  const isLabel = object.object_type === "label";
  const isCircle = object.object_type === "circle" || object.object_type === "round";
  const fill = canvasFill(object);
  const label = canvasLabel(object);
  const width = Math.max(16, object.width * scale);
  const height = Math.max(16, object.height * scale);

  return (
    <View
      pointerEvents="none"
      style={[
        styles.canvasObject,
        isStage ? styles.stageObject : null,
        isLabel ? styles.labelObject : styles.genericObject,
        {
          left: object.x * scale,
          top: object.y * scale,
          width,
          height,
          borderRadius: isCircle ? Math.min(width, height) / 2 : radii.md,
          backgroundColor: fill ?? (isLabel ? "transparent" : undefined),
          transform: [{ rotate: `${object.rotation ?? 0}deg` }],
        },
      ]}
    >
      {label ? (
        <Text
          numberOfLines={2}
          style={[styles.objectLabel, isLabel && styles.floorLabel]}
        >
          {label}
        </Text>
      ) : null}
    </View>
  );
}

function TableShape({ table, scale }: { table: ZoneTable; scale: number }) {
  const size = 56 * scale;
  const round = table.shape === "round" || table.shape === "circle";
  return (
    <View
      pointerEvents="none"
      style={[
        styles.table,
        {
          left: table.x * scale,
          top: table.y * scale,
          width: size,
          height: size,
          borderRadius: round ? size / 2 : 8,
          transform: [{ rotate: `${table.rotation ?? 0}deg` }],
        },
      ]}
    >
      <Text style={styles.objectLabel}>{table.name ?? "Table"}</Text>
    </View>
  );
}

function SeatChip({
  seat,
  selected,
  label,
  onToggle,
  size = GRID_SEAT,
  accent,
  round = false,
}: {
  seat: EventSeat;
  selected: boolean;
  label: string;
  onToggle: (seat: EventSeat) => void;
  size?: number;
  accent?: string | null;
  round?: boolean;
}) {
  const taken = seat.status !== "AVAILABLE";
  const vip = seat.seat_type === "VIP";
  const radius = round ? size / 2 : radii.sm;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Seat ${seat.code}`}
      accessibilityState={{ selected, disabled: taken && !selected }}
      disabled={taken && !selected}
      onPress={() => onToggle(seat)}
      hitSlop={4}
      style={[
        styles.seat,
        {
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          borderRadius: radius,
        },
        accent && !selected && !taken ? { borderColor: accent } : null,
        vip && !selected ? styles.seatVip : null,
        selected && styles.seatSelected,
        taken && !selected && styles.seatTaken,
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.seatText,
          size < 40 && styles.seatTextSmall,
          selected && styles.seatTextSelected,
          taken && !selected && styles.seatTextTaken,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function LegendRow() {
  return (
    <View style={styles.legend}>
      <Legend color={colors.surface} border={colors.border} label="Open" />
      <Legend color={colors.accent} label="Yours" />
      <Legend color={colors.surfaceAlt} label="Taken" />
    </View>
  );
}

function Legend({
  color,
  label,
  border,
}: {
  color: string;
  label: string;
  border?: string;
}) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendSwatch, { backgroundColor: color, borderColor: border ?? color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  canvasFrame: {
    overflow: "hidden",
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  canvasBg: {
    backgroundColor: colors.surfaceAlt,
  },
  canvasHint: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  canvasObject: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  stageObject: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  labelObject: {
    backgroundColor: "transparent",
  },
  genericObject: {
    backgroundColor: "rgba(31, 115, 255, 0.12)",
  },
  table: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  objectLabel: {
    ...typography.caption,
    color: colors.textSubtle,
    fontWeight: "600",
    textAlign: "center",
  },
  floorLabel: {
    color: colors.foreground,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  stage: {
    alignSelf: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.full,
    paddingHorizontal: spacing.xl,
    minHeight: 28,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  stageLabel: {
    ...typography.caption,
    color: colors.textSubtle,
    fontWeight: "600",
  },
  grid: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  rowLabel: {
    ...typography.caption,
    color: colors.textSubtle,
    width: 20,
    textAlign: "center",
    fontWeight: "600",
  },
  seat: {
    minWidth: GRID_SEAT,
    minHeight: GRID_SEAT,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  seatVip: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  seatSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  seatTaken: {
    backgroundColor: colors.surfaceAlt,
    opacity: 0.45,
  },
  seatText: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: "600",
  },
  seatTextSmall: {
    fontSize: 9,
    lineHeight: 11,
  },
  seatTextSelected: {
    color: colors.white,
  },
  seatTextTaken: {
    color: colors.textSubtle,
  },
  legend: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  legendSwatch: {
    width: 12,
    height: 12,
    borderRadius: 4,
    borderWidth: 1,
  },
  legendLabel: {
    ...typography.caption,
    color: colors.textSubtle,
  },
});
