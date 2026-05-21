import { create } from 'zustand';
import type { Album, SmartAlbumRule } from '../types';

// ============================================================
// albumStore — 相册 CRUD + 智能相册规则引擎
// 后期扩展：替换为 WatermelonDB 查询
// ============================================================

interface AlbumState {
  albums: Album[];

  // ---- Actions ----
  setAlbums: (albums: Album[]) => void;
  createAlbum: (name: string, description?: string) => Album;
  createSmartAlbum: (name: string, rules: SmartAlbumRule[], description?: string) => Album;
  updateAlbum: (id: string, patch: Partial<Album>) => void;
  deleteAlbum: (id: string) => void;
  addToAlbum: (albumId: string, photoIds: string[]) => void;
  removeFromAlbum: (albumId: string, photoIds: string[]) => void;
  getAlbumsByPhotoId: (photoId: string) => Album[];

  // 智能相册 — 评估规则是否匹配（后期接入 AI pipeline）
  evaluateSmartRules: (rules: SmartAlbumRule[], photoTags: string[], photoCategory: string) => boolean;
}

let albumCounter = 0;
const nextAlbumId = (): string => `album-${Date.now()}-${++albumCounter}`;

export const useAlbumStore = create<AlbumState>((set, get) => ({
  albums: [],

  setAlbums: (albums) => set({ albums }),

  createAlbum: (name, description = '') => {
    const album: Album = {
      id: nextAlbumId(),
      name,
      description,
      photoCount: 0,
      isSmart: false,
      photoIds: [],
      createdAt: Date.now(),
      sortOrder: get().albums.length,
    };
    set((s) => ({ albums: [...s.albums, album] }));
    return album;
  },

  createSmartAlbum: (name, rules, description = '') => {
    const album: Album = {
      id: nextAlbumId(),
      name,
      description,
      photoCount: 0,
      isSmart: true,
      smartRules: rules,
      photoIds: [],
      createdAt: Date.now(),
      sortOrder: get().albums.length,
    };
    set((s) => ({ albums: [...s.albums, album] }));
    return album;
  },

  updateAlbum: (id, patch) =>
    set((s) => ({
      albums: s.albums.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    })),

  deleteAlbum: (id) =>
    set((s) => ({ albums: s.albums.filter((a) => a.id !== id) })),

  addToAlbum: (albumId, photoIds) =>
    set((s) => ({
      albums: s.albums.map((a) =>
        a.id === albumId
          ? { ...a, photoIds: [...new Set([...a.photoIds, ...photoIds])], photoCount: a.photoCount + photoIds.length }
          : a,
      ),
    })),

  removeFromAlbum: (albumId, photoIds) =>
    set((s) => ({
      albums: s.albums.map((a) =>
        a.id === albumId
          ? {
              ...a,
              photoIds: a.photoIds.filter((pid) => !photoIds.includes(pid)),
              photoCount: a.photoCount - photoIds.length,
            }
          : a,
      ),
    })),

  getAlbumsByPhotoId: (photoId) => get().albums.filter((a) => a.photoIds.includes(photoId)),

  evaluateSmartRules: (rules, photoTags, photoCategory) =>
    rules.every((rule) => {
      switch (rule.field) {
        case 'category':
          return rule.operator === 'equals' ? photoCategory === rule.value : false;
        case 'tags':
          if (rule.operator === 'contains' && typeof rule.value === 'string') {
            return photoTags.some((t) => t.toLowerCase().includes(rule.value.toString().toLowerCase()));
          }
          return false;
        case 'rating':
          // 期望 rule.value 为数字阈值
          return false; // 需要 photo 引用 — 后期实现
        default:
          return false;
      }
    }),
}));
