import { Pressable, View } from 'react-native';
import { TabList, TabSlot, TabTrigger, Tabs, type TabTriggerSlotProps } from 'expo-router/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/ui/Icon';
import { T } from '@/ui/Text';
import { c } from '@/ui/tokens';

const tabs: { name: string; href: '/' | '/explore' | '/promotions' | '/account'; label: string; icon: IconName }[] = [
  { name: 'index', href: '/', label: 'Home', icon: 'home' },
  { name: 'explore', href: '/explore', label: 'Explore', icon: 'compass' },
  { name: 'promotions', href: '/promotions', label: 'Promotions', icon: 'tag' },
  { name: 'account', href: '/account', label: 'Profile', icon: 'user' },
];

/** Main tab bar from the boards: 84pt white bar, blue active item. */
export default function TabsLayout() {
  const { bottom } = useSafeAreaInsets();
  return (
    <Tabs style={{ flex: 1, minHeight: 0, backgroundColor: c.page }}>
      {/* Bound the screen independently of its scrollable content. TabSlot's
          default flexShrink: 0 can otherwise push the bar below the viewport. */}
      <View style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <TabSlot style={{ flex: 1, flexBasis: 0, flexShrink: 1, minHeight: 0 }} />
      </View>
      <View
        accessibilityRole="tablist"
        style={{ flexDirection: 'row', flexShrink: 0, height: 70 + Math.max(14, bottom), paddingBottom: Math.max(14, bottom), backgroundColor: c.white, borderTopWidth: 1, borderTopColor: c.line }}
      >
        {tabs.map(tab => (
          <TabTrigger key={tab.name} name={tab.name} asChild>
            <TabButton label={tab.label} icon={tab.icon} />
          </TabTrigger>
        ))}
      </View>
      <TabList style={{ display: 'none' }}>
        {tabs.map(tab => (
          <TabTrigger key={tab.name} name={tab.name} href={tab.href} />
        ))}
      </TabList>
    </Tabs>
  );
}

function TabButton({ isFocused, label, icon, ...rest }: TabTriggerSlotProps & { label: string; icon: IconName }) {
  const color = isFocused ? c.blue : c.muted;
  return (
    <Pressable
      {...rest}
      accessibilityRole="tab"
      accessibilityState={{ selected: !!isFocused }}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 }}
    >
      <Icon name={icon} size={22} color={color} />
      <T w={isFocused ? 800 : 600} s={11} color={color}>{label}</T>
    </Pressable>
  );
}
