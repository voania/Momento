/**
 * MiMo 相册 — React Native App 根组件
 *
 * Provider 层叠：
 *   GestureHandlerRootView → SafeAreaProvider → PaperProvider → ThemeProvider → NavigationContainer
 *
 * 启动流程：
 *   App → AppBootstrap (useAppInit: 加载设置 + mock 数据) → ThemeGate → RootNavigator
 */
import React from 'react';
import { StatusBar, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useAppTheme } from './src/theme';
import { RootNavigator } from './src/navigation';
import { useSettingsStore } from './src/store';
import { useAppInit } from './src/hooks/useAppInit';
import { ErrorBoundary } from './src/components/shared/ErrorBoundary';
import type { ThemeName } from './src/types';

function AppBootstrap() {
  const ready = useAppInit();
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  if (!ready) {
    return (
      <View style={styles.splash}>
        <Text style={styles.splashIcon}>📸</Text>
        <ActivityIndicator size="large" color="#6750A4" style={{ marginTop: 24 }} />
        <Text style={styles.splashText}>MiMo 相册</Text>
      </View>
    );
  }

  return (
    <ThemeGate themeName={theme} setThemeName={setTheme} />
  );
}

function ThemeGate({
  themeName,
  setThemeName,
}: {
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
}) {
  return (
    <ThemeProvider themeName={themeName} setThemeName={setThemeName}>
      <ThemeGateInner />
    </ThemeProvider>
  );
}

function ThemeGateInner() {
  const { md3Theme, isDark } = useAppTheme();

  return (
    <PaperProvider theme={md3Theme}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={md3Theme.colors.background}
      />
      <ErrorBoundary>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </ErrorBoundary>
    </PaperProvider>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AppBootstrap />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1B1F',
  },
  splashIcon: { fontSize: 64 },
  splashText: {
    color: '#D0BCFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
  },
});

export default App;
