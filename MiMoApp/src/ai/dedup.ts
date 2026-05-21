// ============================================================
// 去重引擎 — pHash + 余弦相似度
// 后期实现：TypeScript 原生实现 8x8 灰度 DCT pHash
// ============================================================

import type { Photo } from '../types';

export interface DedupResult {
  duplicates: Array<{ original: Photo; duplicate: Photo; similarity: number }>;
}

/**
 * 计算两张照片的相似度（0~1）
 * 当前为 stub，后期实现 pHash 汉明距离 + 余弦相似度
 */
export function computeSimilarity(a: Photo, b: Photo): number {
  if (a.phash && b.phash) {
    return hammingSimilarity(a.phash, b.phash);
  }
  // fallback: 基于颜色和尺寸的快速排除
  return 0;
}

function hammingSimilarity(h1: string, h2: string): number {
  if (h1.length !== h2.length) return 0;
  let same = 0;
  for (let i = 0; i < h1.length; i++) {
    if (h1[i] === h2[i]) same++;
  }
  return same / h1.length;
}

/**
 * 全量去重扫描
 */
export function findDuplicates(photos: Photo[], threshold = 0.9): DedupResult {
  const duplicates: DedupResult['duplicates'] = [];

  for (let i = 0; i < photos.length; i++) {
    for (let j = i + 1; j < photos.length; j++) {
      const sim = computeSimilarity(photos[i], photos[j]);
      if (sim >= threshold) {
        duplicates.push({
          original: photos[i],
          duplicate: photos[j],
          similarity: sim,
        });
      }
    }
  }

  return { duplicates };
}
