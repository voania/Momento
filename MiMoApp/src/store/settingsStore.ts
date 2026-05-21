import { create } from 'zustand';
import type { AppSettings, ThemeName } from '../types';

// ============================================================
// settingsStore — 持久化应用设置
// 使用 MMKV 作为后端（后期替换 AsyncStorage → react-native-mmkv）
// 接口设计：settingsStore 只暴露 get/set，不关心存储后端
// ============================================================

const STORAGE_KEY = 'mimo-settings';

interface SettingsState extends AppSettings {
  // 水合状态
  isHydrated: boolean;

  // ---- Actions ----
  loadSettings: () => Promise<void>;
  persistSettings: () => Promise<void>;

  setTheme: (theme: ThemeName) => void;
  setGridColumns: (cols: number) => void;
  setPin: (code: string | null) => void;
  setPinEnabled: (enabled: boolean) => void;
  setBiometricEnabled: (enabled: boolean) => void;
  setShowFabLabels: (show: boolean) => void;
  setOnboardingComplete: (done: boolean) => void;
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  setLastImportTimestamp: (ts: number) => void;

  // 批量更新（一次性改多个设置）
  updateSettings: (patch: Partial<AppSettings>) => void;
}

const defaults: AppSettings = {
  theme: 'dynamic',
  gridColumns: 3,
  pinEnabled: false,
  pinCode: null,
  biometricEnabled: false,
  showFabLabels: true,
  onboardingComplete: false,
  searchHistory: [],
  lastImportTimestamp: null,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...defaults,
  isHydrated: false,

  loadSettings: async () => {
    try {
      // 后期替换为 MMKV: const raw = mmkv.getString(STORAGE_KEY);
      // RN 无内建持久化存储，当前使用内存默认值
      set({ isHydrated: true });
    } catch {
      set({ isHydrated: true });
    }
  },

  persistSettings: async () => {
    // 后期替换为 MMKV: mmkv.set(STORAGE_KEY, JSON.stringify(settings));
    // 当前：不持久化（Phase 1 使用内存存储）
  },

  setTheme: (theme) => {
    set({ theme });
    get().persistSettings();
  },
  setGridColumns: (cols) => {
    set({ gridColumns: cols });
    get().persistSettings();
  },
  setPin: (code) => {
    set({ pinCode: code });
    get().persistSettings();
  },
  setPinEnabled: (enabled) => {
    set({ pinEnabled: enabled });
    get().persistSettings();
  },
  setBiometricEnabled: (enabled) => {
    set({ biometricEnabled: enabled });
    get().persistSettings();
  },
  setShowFabLabels: (show) => {
    set({ showFabLabels: show });
    get().persistSettings();
  },
  setOnboardingComplete: (done) => {
    set({ onboardingComplete: done });
    get().persistSettings();
  },
  addSearchHistory: (query) => {
    set((s) => ({
      searchHistory: [query, ...s.searchHistory.filter((h) => h !== query)].slice(0, 20),
    }));
    get().persistSettings();
  },
  clearSearchHistory: () => {
    set({ searchHistory: [] });
    get().persistSettings();
  },
  setLastImportTimestamp: (ts) => {
    set({ lastImportTimestamp: ts });
    get().persistSettings();
  },

  updateSettings: (patch) => {
    set(patch);
    get().persistSettings();
  },
}));
