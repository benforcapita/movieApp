import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chrome as Home, Search, Bookmark, User } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const color = focused ? Colors.accent : Colors.gray;
  const size = 24;

  switch (name) {
    case 'index':
      return <Home color={color} size={size} />;
    case 'search':
      return <Search color={color} size={size} />;
    case 'saved':
      return <Bookmark color={color} size={size} />;
    case 'profile':
      return <User color={color} size={size} />;
    default:
      return <Home color={color} size={size} />;
  }
};

export default function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
      <BlurView intensity={80} tint="dark" style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={[
                styles.tab,
                isFocused && styles.activeTab
              ]}
            >
              <TabIcon name={route.name} focused={isFocused} />
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Platform.OS === 'ios' ? 'rgba(21, 19, 18, 0.8)' : Colors.secondary,
    borderRadius: 25,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    backgroundColor: 'rgba(171, 139, 255, 0.2)',
  },
});