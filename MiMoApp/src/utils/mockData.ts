// ============================================================
// Mock 数据生成器 — 生成真实感测试数据
// 后期接入真实照片后移除
// ============================================================

import type { Photo, ExifData, Category } from '../types';

const SAMPLE_FILENAMES = [
  'IMG_20250315_143022.jpg',
  'IMG_20250315_143145.jpg',
  'IMG_20250316_092134.jpg',
  'IMG_20250317_181522.jpg',
  'IMG_20250318_073045.jpg',
  'IMG_20250319_120344.jpg',
  'IMG_20250320_155632.jpg',
  'IMG_20250321_094511.jpg',
  'IMG_20250322_163820.jpg',
  'IMG_20250401_082103.jpg',
  'IMG_20250405_190247.jpg',
  'IMG_20250410_112558.jpg',
  'IMG_20250415_144319.jpg',
  'IMG_20250501_070123.jpg',
  'IMG_20250505_173456.jpg',
  'IMG_20250510_093215.jpg',
  'IMG_20250515_125043.jpg',
  'IMG_20250520_162738.jpg',
  'IMG_20250601_081522.jpg',
  'IMG_20250610_145901.jpg',
  'IMG_20250715_112034.jpg',
  'IMG_20250801_170045.jpg',
  'IMG_20250910_083216.jpg',
  'IMG_20251020_191234.jpg',
];

const LOCATIONS = [
  '北京 · 故宫',
  '上海 · 外滩',
  '杭州 · 西湖',
  '三亚 · 亚龙湾',
  '成都 · 宽窄巷子',
  '厦门 · 鼓浪屿',
  null,
  null,
  null,
];

const CATEGORIES: Category[] = ['person', 'landscape', 'document', 'pet', 'food', 'object', 'other'];

const COLORS = [
  '#6750A4', '#E91E63', '#4CAF50', '#2196F3', '#FF9800',
  '#9C27B0', '#009688', '#FF5722', '#607D8B', '#795548',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMockPhoto(id: number): Photo {
  const filename = SAMPLE_FILENAMES[id % SAMPLE_FILENAMES.length];
  const year = randomInt(2024, 2025);
  const month = String(randomInt(1, 12)).padStart(2, '0');
  const day = String(randomInt(1, 28)).padStart(2, '0');
  const hour = String(randomInt(6, 22)).padStart(2, '0');
  const min = String(randomInt(0, 59)).padStart(2, '0');
  const sec = String(randomInt(0, 59)).padStart(2, '0');
  const dateTaken = `${year}-${month}-${day}`;
  const timeTaken = `${hour}:${min}:${sec}`;
  const width = pick([1920, 2048, 3024, 4032]);
  const height = pick([1080, 1536, 3024, 3024]);
  const location = pick(LOCATIONS);

  const exif: ExifData = {
    make: pick(['Apple', 'Samsung', 'Google', 'Sony', 'Canon', undefined]),
    model: pick(['iPhone 15 Pro', 'Galaxy S24', 'Pixel 8', 'A7 IV', undefined]),
    fNumber: pick([1.8, 2.8, 4, 5.6, undefined]),
    exposureTime: pick(['1/125', '1/250', '1/500', '1/1000', undefined]),
    iso: pick([100, 200, 400, 800, undefined]),
    focalLength: pick(['24mm', '35mm', '50mm', '85mm', undefined]),
    flash: pick([true, false]),
    width,
    height,
  };

  const category = pick(CATEGORIES);
  const tags = generateTags(category);

  return {
    id: `photo-${id}`,
    uri: `https://picsum.photos/seed/${id}/${width}/${height}`,
    thumbnailUri: `https://picsum.photos/seed/${id}/256/256`,
    filename,
    sizeBytes: randomInt(1_500_000, 8_000_000),
    width,
    height,
    createdAt: new Date(dateTaken).getTime(),
    dateTaken,
    timeTaken,
    latitude: location ? randomInt(18, 40) + Math.random() : null,
    longitude: location ? randomInt(100, 120) + Math.random() : null,
    locationName: location,
    exif,
    color: pick(COLORS),
    isFavorite: Math.random() > 0.8,
    isHidden: false,
    isPinned: Math.random() > 0.95,
    isDeleted: false,
    aiTags: tags,
    aiCategory: category,
    faceCount: category === 'person' ? randomInt(1, 5) : null,
    phash: null,
    embedding: null,
    duplicateOfId: null,
    edits: {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      rotation: 0,
      crop: null,
      filter: null,
    },
    versions: [],
    rating: pick([0, 0, 0, 1, 2, 3, 4, 5]),
  };
}

function generateTags(category: Category): string[] {
  const tagMap: Record<Category, string[]> = {
    person: ['人像', '自拍', '合影', '户外', '阳光'],
    landscape: ['风景', '自然', '蓝天', '山水', '旅行'],
    document: ['文档', '扫描', '表格', '合同', '笔记'],
    pet: ['宠物', '猫', '狗', '可爱', '室内'],
    food: ['美食', '餐厅', '晚餐', '甜点', '饮品'],
    object: ['物品', '特写', '日常', '室内'],
    other: ['照片'],
  };
  const pool = tagMap[category] || tagMap.other;
  const count = randomInt(2, pool.length);
  return pool.slice(0, count);
}

export function generateMockPhotos(count = 0): Photo[] {
  return Array.from({ length: count > 0 ? count : SAMPLE_FILENAMES.length }, (_, i) =>
    generateMockPhoto(i),
  );
}
