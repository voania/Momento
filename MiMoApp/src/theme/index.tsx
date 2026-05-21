import React, { createContext, useContext, useMemo } from 'react';
import { MD3LightTheme, MD3DarkTheme, useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import type { ThemeName } from '../types';

// ============================================================
// MD3 主题系统 — 5 套配色方案 + 明暗自动切换
// 后期扩展：在 schemes 中添加新配色即可，接口不变
// ============================================================

// ---- 自定义颜色令牌（MD3 扩展）----
export interface AppTokens {
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  fabBackground: string;
  fabForeground: string;
  cardElevated: string;
  badgeBackground: string;
  badgeForeground: string;
  ripple: string;
}

// ---- 5 套配色方案的色源 ----
const SCHEME_SOURCES: Record<ThemeName, { light: string; dark: string }> = {
  dynamic: { light: '#6750A4', dark: '#D0BCFF' },
  mint:    { light: '#006D41', dark: '#7BDB80' },
  sunset:  { light: '#BA1A1A', dark: '#FFB4AB' },
  ocean:   { light: '#004D91', dark: '#ABC7FF' },
  forest:  { light: '#386A20', dark: '#A7E888' },
};

// ---- 为每个主题名生成 light + dark theme ----
function buildThemes(): Record<ThemeName, { light: MD3Theme; dark: MD3Theme }> {
  const entries = Object.entries(SCHEME_SOURCES) as [ThemeName, { light: string; dark: string }][];

  const result: Record<string, { light: MD3Theme; dark: MD3Theme }> = {};

  for (const [name, { light: seedLight, dark: seedDark }] of entries) {
    // 对每个 seed 调用 source() 构造主题 (react-native-paper MD3LightTheme 定制)
    // 注：完整 MD3 scheme 生成需要 @material/material-color-utilities
    // 此处使用 seed color 作为 primary，手动调色板差值
    result[name] = {
      light: {
        ...MD3LightTheme,
        colors: {
          ...MD3LightTheme.colors,
          primary: seedLight,
          primaryContainer: seedLight + '33',
          onPrimaryContainer: seedLight,
          secondary: seedLight + 'CC',
          secondaryContainer: seedLight + '1A',
        },
      },
      dark: {
        ...MD3DarkTheme,
        colors: {
          ...MD3DarkTheme.colors,
          primary: seedDark,
          primaryContainer: seedDark + '33',
          onPrimaryContainer: seedDark,
          secondary: seedDark + 'CC',
          secondaryContainer: seedDark + '1A',
        },
      },
    };
  }

  return result as Record<ThemeName, { light: MD3Theme; dark: MD3Theme }>;
}

const THEMES = buildThemes();

// ---- Context ----
interface ThemeContextValue {
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  md3Theme: MD3Theme;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useAppTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used within ThemeProvider');
  return ctx;
}

// 便捷 hook — 直接拿 MD3Theme（兼容 react-native-paper 的 useTheme）
export function useMd3Theme(): MD3Theme {
  return useAppTheme().md3Theme;
}

// ---- Provider ----
export function ThemeProvider({
  themeName,
  setThemeName,
  children,
}: {
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  children: React.ReactNode;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const md3Theme = useMemo(() => THEMES[themeName][isDark ? 'dark' : 'light'], [themeName, isDark]);

  const value = useMemo<ThemeContextValue>(
    () => ({ themeName, setThemeName, md3Theme, isDark }),
    [themeName, setThemeName, md3Theme, isDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
