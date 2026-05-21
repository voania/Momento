import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useMd3Theme } from '../theme';
import type { MainTabParamList } from '../types';

// Screen stubs — 后期替换为真实屏幕
import { GridScreen } from '../screens/GridScreen';
import { TimelineScreen } from '../screens/TimelineScreen';
import { MapScreen } from '../screens/MapScreen';
import { CategoryScreen } from '../screens/CategoryScreen';
import { TrashScreen } from '../screens/TrashScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// 图标名（后期用 @expo/vector-icons 或 react-native-vector-icons）
const TAB_ICONS: Record<keyof MainTabParamList, { active: string; inactive: string }> = {
  GridTab:     { active: 'apps', inactive: 'apps-outline' },
  TimelineTab: { active: 'time', inactive: 'time-outline' },
  MapTab:      { active: 'map', inactive: 'map-outline' },
  CategoryTab: { active: 'albums', inactive: 'albums-outline' },
  TrashTab:    { active: 'trash', inactive: 'trash-outline' },
};

const TAB_LABELS: Record<keyof MainTabParamList, string> = {
  GridTab: '相册',
  TimelineTab: '时间线',
  MapTab: '地图',
  CategoryTab: '分类',
  TrashTab: '回收站',
};

export function TabNavigator() {
  const theme = useMd3Theme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
          borderTopWidth: 0.5,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        // 后期替换为 Icon 组件
        tabBarIcon: ({ color, size }) => null,
      })}
    >
      <Tab.Screen
        name="GridTab"
        component={GridScreen}
        options={{ tabBarLabel: TAB_LABELS.GridTab }}
      />
      <Tab.Screen
        name="TimelineTab"
        component={TimelineScreen}
        options={{ tabBarLabel: TAB_LABELS.TimelineTab }}
      />
      <Tab.Screen
        name="MapTab"
        component={MapScreen}
        options={{ tabBarLabel: TAB_LABELS.MapTab }}
      />
      <Tab.Screen
        name="CategoryTab"
        component={CategoryScreen}
        options={{ tabBarLabel: TAB_LABELS.CategoryTab }}
      />
      <Tab.Screen
        name="TrashTab"
        component={TrashScreen}
        options={{ tabBarLabel: TAB_LABELS.TrashTab }}
      />
    </Tab.Navigator>
  );
}
