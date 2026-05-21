import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSettingsStore } from '../store';
import type { RootStackParamList } from '../types';

import { TabNavigator } from './TabNavigator';
import { LockScreen } from '../screens/LockScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { LightboxScreen } from '../screens/LightboxScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AlbumDetailScreen } from '../screens/AlbumDetailScreen';
import { EditPanelScreen } from '../screens/EditPanelScreen';
import { PeopleScreen } from '../screens/PeopleScreen';
import { HiddenScreen } from '../screens/HiddenScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { AlbumsScreen } from '../screens/AlbumsScreen';
import { SlideshowScreen } from '../screens/SlideshowScreen';
import { CollageScreen } from '../screens/CollageScreen';
import { VersionHistoryScreen } from '../screens/VersionHistoryScreen';
import { StorageDashboardScreen } from '../screens/StorageDashboardScreen';
import { SearchResultsScreen } from '../screens/SearchResultsScreen';
import { CompareScreen } from '../screens/CompareScreen';
import { FaceGroupDetailScreen } from '../screens/FaceGroupDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const pinEnabled = useSettingsStore((s) => s.pinEnabled);
  const onboardingComplete = useSettingsStore((s) => s.onboardingComplete);

  // 初始路由：未完成引导 → Onboarding，已启用 PIN → Lock，否则 → Main
  const initialRoute = !onboardingComplete
    ? 'Onboarding'
    : pinEnabled
      ? 'Lock'
      : 'Main';

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      {/* ---- 锁屏 & 引导（无 tab bar）---- */}
      <Stack.Screen name="Lock" component={LockScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />

      {/* ---- 主界面（5 tabs）---- */}
      <Stack.Screen name="Main" component={TabNavigator} />

      {/* ---- 全屏模态子页面 ---- */}
      <Stack.Screen
        name="Lightbox"
        component={LightboxScreen}
        options={{ animation: 'fade', gestureEnabled: true }}
      />
      <Stack.Screen
        name="EditPanel"
        component={EditPanelScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="AlbumDetail" component={AlbumDetailScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="People" component={PeopleScreen} />
      <Stack.Screen name="Hidden" component={HiddenScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="Albums" component={AlbumsScreen} />
      <Stack.Screen
        name="Slideshow"
        component={SlideshowScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="Collage"
        component={CollageScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="VersionHistory"
        component={VersionHistoryScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="StorageDashboard"
        component={StorageDashboardScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="Compare"
        component={CompareScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="FaceGroupDetail"
        component={FaceGroupDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}
