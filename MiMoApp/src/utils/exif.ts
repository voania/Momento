// ============================================================
// EXIF 元数据解析
// 后期用 react-native-exif 或 expo-media-library
// ============================================================

import type { ExifData } from '../types';

export function parseExif(_uri: string): Promise<ExifData> {
  // 后期实现
  return Promise.resolve({ width: 0, height: 0 });
}

export function formatExifValue(exif: ExifData, key: keyof ExifData): string {
  const val = exif[key];
  switch (key) {
    case 'fNumber': return val ? `f/${val}` : '—';
    case 'exposureTime': return val ? `${val}s` : '—';
    case 'iso': return val ? `ISO ${val}` : '—';
    case 'focalLength': return val ? `${val}mm` : '—';
    case 'flash': return val ? '开' : '关';
    default: return val ? String(val) : '—';
  }
}
