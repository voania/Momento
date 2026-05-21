import { useMemo } from 'react';
import { usePhotoStore } from '../store';
import type { MemoryPhoto } from '../types';

// ============================================================
// useMemoryPhotos — "那年今天" 功能
// 匹配去年同月同日拍摄的照片
// ============================================================

export function useMemoryPhotos(): MemoryPhoto[] {
  const photos = usePhotoStore((s) => s.photos);

  return useMemo(() => {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const thisYear = today.getFullYear();
    const todayStr = `${mm}-${dd}`;

    return photos
      .filter((p) => !p.isDeleted)
      .filter((p) => {
        const photoYear = parseInt(p.dateTaken.slice(0, 4), 10);
        return photoYear < thisYear && p.dateTaken.slice(5) === todayStr;
      })
      .map((p) => {
        const photoYear = p.dateTaken.slice(0, 4);
        const yearsAgo = thisYear - parseInt(photoYear, 10);
        return {
          id: `mem-${p.id}`,
          photoId: p.id,
          title: `${yearsAgo}年前的今天`,
          subtitle: p.locationName || p.dateTaken,
          date: p.dateTaken,
        };
      });
  }, [photos]);
}
