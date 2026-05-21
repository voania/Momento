import { create } from 'zustand';
import type { ViewMode } from '../types';

// ============================================================
// uiStore — 全局 UI 状态（Toast、模态、浮层、Sheet）
// 任何组件都可以通过此 store 触发 UI 反馈
// ============================================================

export interface ToastMessage {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'error';
  durationMs: number;
}

interface UiState {
  // 当前视图 & 缩略图列数
  activeView: ViewMode;
  gridColumns: number;

  // Toast 队列
  toasts: ToastMessage[];

  // 模态/浮层 可见性
  isFabOpen: boolean;
  isSearchActive: boolean;
  isDrawerOpen: boolean;
  isAiOverlayVisible: boolean;
  isDedupOverlayVisible: boolean;
  isStatsModalVisible: boolean;
  isSettingsModalVisible: boolean;
  isAlbumPickerVisible: boolean;

  // 列表滚动位置（用于返回时恢复）
  gridScrollOffset: number;

  // ---- Actions ----
  setActiveView: (view: ViewMode) => void;
  setGridColumns: (cols: number) => void;
  showToast: (text: string, type?: ToastMessage['type'], durationMs?: number) => void;
  dismissToast: (id: string) => void;
  toggleFab: (open?: boolean) => void;
  setSearchActive: (active: boolean) => void;
  setDrawerOpen: (open: boolean) => void;
  setAiOverlayVisible: (visible: boolean) => void;
  setDedupOverlayVisible: (visible: boolean) => void;
  setStatsModalVisible: (visible: boolean) => void;
  setSettingsModalVisible: (visible: boolean) => void;
  setAlbumPickerVisible: (visible: boolean) => void;
  setGridScrollOffset: (offset: number) => void;
}

let toastId = 0;

export const useUiStore = create<UiState>((set) => ({
  activeView: 'grid',
  gridColumns: 3,
  toasts: [],
  isFabOpen: false,
  isSearchActive: false,
  isDrawerOpen: false,
  isAiOverlayVisible: false,
  isDedupOverlayVisible: false,
  isStatsModalVisible: false,
  isSettingsModalVisible: false,
  isAlbumPickerVisible: false,
  gridScrollOffset: 0,

  setActiveView: (view) => set({ activeView: view }),
  setGridColumns: (cols) => set({ gridColumns: cols }),

  showToast: (text, type = 'info', durationMs = 2500) => {
    const id = `toast-${++toastId}`;
    set((s) => ({ toasts: [...s.toasts, { id, text, type, durationMs }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, durationMs);
  },

  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  toggleFab: (open) => set((s) => ({ isFabOpen: open !== undefined ? open : !s.isFabOpen })),
  setSearchActive: (active) => set({ isSearchActive: active }),
  setDrawerOpen: (open) => set({ isDrawerOpen: open }),
  setAiOverlayVisible: (visible) => set({ isAiOverlayVisible: visible }),
  setDedupOverlayVisible: (visible) => set({ isDedupOverlayVisible: visible }),
  setStatsModalVisible: (visible) => set({ isStatsModalVisible: visible }),
  setSettingsModalVisible: (visible) => set({ isSettingsModalVisible: visible }),
  setAlbumPickerVisible: (visible) => set({ isAlbumPickerVisible: visible }),
  setGridScrollOffset: (offset) => set({ gridScrollOffset: offset }),
}));
