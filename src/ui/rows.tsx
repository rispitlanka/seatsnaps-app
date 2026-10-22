import type { ReactNode } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import type { Organiser } from '@/mocks/catalog';

import { Avatar, FollowPill, Tap } from './components';
import { Icon, VerifiedIcon } from './Icon';
import { T } from './Text';
import { c } from './tokens';

/** Organiser list row (C4, C7, D1). */
export function OrganiserRow({ org, title, following, onFollow, padding = { v: 10, h: 12 } }: { org: Organiser; title?: ReactNode; following?: boolean; onFollow?: () => void; padding?: { v: number; h: number } }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: padding.v, paddingHorizontal: padding.h, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 18 }}>
      {/* The pill is a sibling, not a child, so both stay separately reachable by screen readers. */}
      <Tap
        accessibilityRole="button"
        accessibilityLabel={`${org.name}, ${org.meta}`}
        onPress={() => router.push({ pathname: '/explore/organiser/[id]', params: { id: org.id } })}
        style={{ flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 12 }}
      >
        <Avatar initials={org.initials} bg={org.bg} fg={org.fg} textSize={16} />
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <T w={800} s={15} style={{ flexShrink: 1 }}>{title ?? org.name}</T>
            {org.verified ? <VerifiedIcon /> : null}
          </View>
          <T s={12} color={c.muted}>{org.meta}</T>
        </View>
      </Tap>
      <FollowPill following={following} onPress={onFollow} />
    </View>
  );
}

/** Venue row with pin tile (C7). */
export function VenueRow({ name, meta, onPress }: { name: string; meta: string; onPress?: () => void }) {
  return (
    <Tap accessibilityRole="button" accessibilityLabel={name} onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: c.white, borderWidth: 1, borderColor: c.line, borderRadius: 18 }}>
      <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: c.blueSoft, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="pin" size={20} color={c.blue} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <T w={800} s={15}>{name}</T>
        <T s={12} color={c.muted}>{meta}</T>
      </View>
      <Icon name="chevronRight" size={18} color={c.subtle} stroke={2.2} />
    </Tap>
  );
}
