// ============================================================
// 图片处理工具 — EXIF、缩略图、颜色提取
// ============================================================

// 从图片 URI 生成缩略图路径
export function getThumbnailUri(uri: string, size = 256): string {
  // 后期用 react-native-image-resizer 或 sharp 生成
  return uri.replace(/\.(jpg|png|heic)$/i, `_thumb${size}.$1`);
}

// 提取主色（快速版，取像素平均值）
export function extractDominantColor(_uri: string): Promise<string> {
  // 后期用 react-native-skia 或原生模块
  return Promise.resolve('#6750A4');
}

// 图片大小格式化
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
