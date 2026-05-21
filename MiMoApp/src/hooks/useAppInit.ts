import { useEffect, useState } from 'react';
import { usePhotoStore, useSettingsStore } from '../store';
import { generateMockPhotos } from '../utils/mockData';

// ============================================================
// useAppInit — 应用启动初始化
// 1. 加载持久化设置
// 2. 加载 mock 数据（后期替换为真实 DB 查询）
// ============================================================

export function useAppInit(): boolean {
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const isHydrated = useSettingsStore((s) => s.isHydrated);
  const setPhotos = usePhotoStore((s) => s.setPhotos);
  const photos = usePhotoStore((s) => s.photos);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      // 1. 加载设置
      await loadSettings();

      // 2. 如果有照片数据则跳过 mock（后期从 DB 加载）
      if (photos.length > 0) {
        if (!cancelled) setReady(true);
        return;
      }

      // 3. 生成 mock 数据（模拟首次启动）
      const mockPhotos = generateMockPhotos(24);
      setPhotos(mockPhotos);

      if (!cancelled) setReady(true);
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return ready && isHydrated;
}
