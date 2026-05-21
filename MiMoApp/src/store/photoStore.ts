import { create } from 'zustand';
import type { Photo, PhotoFilter, SortMode, Category } from '../types';

// ============================================================
// photoStore — 照片数据 + 筛选 + 排序 + 选择
// 后期扩展：替换 actions 中的 mock/memory 实现为 DB 查询
// ============================================================

interface PhotoState {
  // 数据
  photos: Photo[];
  // 筛选 & 排序
  sortMode: SortMode;
  filter: PhotoFilter;
  // 多选模式
  selectionMode: boolean;
  selectedIds: Set<string>;
  // 视图
  isGridReady: boolean;

  // ---- Actions ----
  setPhotos: (photos: Photo[]) => void;
  addPhotos: (photos: Photo[]) => void;
  updatePhoto: (id: string, patch: Partial<Photo>) => void;
  removePhotos: (ids: string[]) => void;

  // 筛选
  setSortMode: (mode: SortMode) => void;
  setFilter: (patch: Partial<PhotoFilter>) => void;
  resetFilter: () => void;

  // 多选
  toggleSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  enterSelection: () => void;
  exitSelection: () => void;

  // 批量操作
  batchFavorite: () => void;
  batchDelete: () => void;
  batchHide: () => void;

  // 计算属性风格的 getter（通过函数调用）
  getFilteredPhotos: () => Photo[];
  getPhotoById: (id: string) => Photo | undefined;
}

const defaultFilter: PhotoFilter = {
  category: null,
  isFavorite: null,
  dateRange: null,
  location: null,
  searchQuery: '',
};

export const usePhotoStore = create<PhotoState>((set, get) => ({
  photos: [],
  sortMode: 'date-desc',
  filter: { ...defaultFilter },
  selectionMode: false,
  selectedIds: new Set(),
  isGridReady: false,

  setPhotos: (photos) => set({ photos, isGridReady: true }),
  addPhotos: (photos) => set((s) => ({ photos: [...photos, ...s.photos] })),
  updatePhoto: (id, patch) =>
    set((s) => ({
      photos: s.photos.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),
  removePhotos: (ids) =>
    set((s) => ({
      photos: s.photos.filter((p) => !ids.includes(p.id)),
      selectedIds: new Set([...s.selectedIds].filter((sid) => !ids.includes(sid))),
    })),

  setSortMode: (mode) => set({ sortMode: mode }),
  setFilter: (patch) => set((s) => ({ filter: { ...s.filter, ...patch } })),
  resetFilter: () => set({ filter: { ...defaultFilter } }),

  toggleSelection: (id) =>
    set((s) => {
      const next = new Set(s.selectedIds);
      next.has(id) ? next.delete(id) : next.add(id);
      return { selectedIds: next };
    }),
  selectAll: (ids) => set({ selectedIds: new Set(ids) }),
  clearSelection: () => set({ selectedIds: new Set(), selectionMode: false }),
  enterSelection: () => set({ selectionMode: true, selectedIds: new Set() }),
  exitSelection: () => set({ selectionMode: false, selectedIds: new Set() }),

  batchFavorite: () => {
    const { photos, selectedIds } = get();
    const allFav = [...selectedIds].every((id) => photos.find((p) => p.id === id)?.isFavorite);
    set((s) => ({
      photos: s.photos.map((p) =>
        selectedIds.has(p.id) ? { ...p, isFavorite: !allFav } : p,
      ),
      selectedIds: new Set(),
      selectionMode: false,
    }));
  },
  batchDelete: () => {
    const { selectedIds } = get();
    set((s) => ({
      photos: s.photos.map((p) =>
        selectedIds.has(p.id) ? { ...p, isDeleted: true, deletedAt: Date.now() } : p,
      ),
      selectedIds: new Set(),
      selectionMode: false,
    }));
  },
  batchHide: () => {
    const { selectedIds } = get();
    set((s) => ({
      photos: s.photos.map((p) =>
        selectedIds.has(p.id) ? { ...p, isHidden: true } : p,
      ),
      selectedIds: new Set(),
      selectionMode: false,
    }));
  },

  getFilteredPhotos: () => {
    const { photos, sortMode, filter } = get();
    let result = photos.filter((p) => !p.isDeleted);
    if (filter.category) result = result.filter((p) => p.aiCategory === filter.category);
    if (filter.isFavorite) result = result.filter((p) => p.isFavorite);
    if (filter.location) result = result.filter((p) => p.locationName?.includes(filter.location!));
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.filename.toLowerCase().includes(q) ||
          (p.aiTags && p.aiTags.some((t) => t.toLowerCase().includes(q))) ||
          p.locationName?.toLowerCase().includes(q) ||
          p.dateTaken.includes(q),
      );
    }
    // 排序
    result.sort((a, b) => {
      switch (sortMode) {
        case 'date-asc': return a.createdAt - b.createdAt;
        case 'name': return a.filename.localeCompare(b.filename);
        case 'size': return a.sizeBytes - b.sizeBytes;
        case 'date-desc':
        default: return b.createdAt - a.createdAt;
      }
    });
    return result;
  },

  getPhotoById: (id) => get().photos.find((p) => p.id === id),
}));
