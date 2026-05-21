// ============================================================
// MiMo 相册 — 核心类型定义
// 所有模块共享的类型接口，后期修改时优先从这里扩展
// ============================================================

// ---- 照片分类 ----
export type Category = 'person' | 'landscape' | 'document' | 'pet' | 'food' | 'object' | 'other';

export const CATEGORY_LABELS: Record<Category, string> = {
  person: '人物',
  landscape: '风景',
  document: '文档',
  pet: '宠物',
  food: '食物',
  object: '物品',
  other: '其他',
};

// ---- EXIF 元数据 ----
export interface ExifData {
  make?: string;
  model?: string;
  fNumber?: number;
  exposureTime?: string;
  iso?: number;
  focalLength?: string;
  flash?: boolean;
  gpsLat?: number;
  gpsLon?: number;
  dateTaken?: string;
  software?: string;
  width: number;
  height: number;
}

// ---- 编辑状态 ----
export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EditState {
  brightness: number;   // -100 .. 100
  contrast: number;     // -100 .. 100
  saturation: number;   // -100 .. 100
  rotation: number;     // 0 | 90 | 180 | 270
  crop: CropRect | null;
  filter: string | null;
}

export interface EditVersion {
  id: string;
  timestamp: number;
  thumbnailUri: string;
  description: string;
}

// ---- 照片（核心数据模型）----
export interface Photo {
  id: string;
  uri: string;
  thumbnailUri?: string;
  filename: string;
  sizeBytes: number;
  width: number;
  height: number;
  createdAt: number;
  dateTaken: string;
  timeTaken: string;
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
  exif: ExifData;
  color: string;                   // 从图片提取的主色，用于占位背景
  isFavorite: boolean;
  isHidden: boolean;
  isPinned: boolean;
  isDeleted: boolean;
  deletedAt?: number;
  aiTags: string[] | null;
  aiCategory: Category | null;
  faceCount: number | null;
  phash: string | null;            // 感知哈希（去重用）
  embedding: number[] | null;      // 特征向量（语义搜索用）
  duplicateOfId: string | null;    // 指向被标记为重复的主照片
  edits: EditState;
  versions: EditVersion[];
  rating: number;                  // 0-5 星
}

// ---- 相册 ----
export interface SmartAlbumRule {
  field: 'category' | 'tags' | 'rating' | 'dateRange' | 'location';
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'between';
  value: string | string[] | number | number[];
}

export interface Album {
  id: string;
  name: string;
  description: string;
  coverUri?: string;
  photoCount: number;
  isSmart: boolean;
  smartRules?: SmartAlbumRule[];
  photoIds: string[];
  createdAt: number;
  sortOrder: number;
}

// ---- AI 分析 ----
export interface OcrBlock {
  text: string;
  bounds: { x: number; y: number; width: number; height: number };
  confidence: number;
}

export interface AiAnalysisResult {
  photoId: string;
  labels: string[];
  category: Category;
  faceCount: number;
  textBlocks: OcrBlock[];
  embedding?: number[];
}

export interface AiError {
  photoId: string;
  message: string;
  timestamp: number;
}

export interface AiPipelineStatus {
  isRunning: boolean;
  queueSize: number;
  processedCount: number;
  currentPhotoId?: string;
  errors: AiError[];
}

// ---- 主题 ----
export type ThemeName = 'dynamic' | 'mint' | 'sunset' | 'ocean' | 'forest';

export const THEME_NAMES: ThemeName[] = ['dynamic', 'mint', 'sunset', 'ocean', 'forest'];

export const THEME_LABELS: Record<ThemeName, string> = {
  dynamic: '动态取色',
  mint: '薄荷绿',
  sunset: '日落暖',
  ocean: '海洋蓝',
  forest: '森林',
};

// ---- 应用设置 ----
export interface AppSettings {
  theme: ThemeName;
  gridColumns: number;
  pinEnabled: boolean;
  pinCode: string | null;
  biometricEnabled: boolean;
  showFabLabels: boolean;
  onboardingComplete: boolean;
  searchHistory: string[];
  lastImportTimestamp: number | null;
}

// ---- 视图/筛选 ----
export type ViewMode = 'grid' | 'timeline' | 'map' | 'category' | 'trash';

export type SortMode = 'date-desc' | 'date-asc' | 'name' | 'size';

export interface PhotoFilter {
  category: Category | null;
  isFavorite: boolean | null;
  dateRange: { start: string; end: string } | null;
  location: string | null;
  searchQuery: string;
}

// ---- 导航类型 ----
export type RootStackParamList = {
  Lock: undefined;
  Main: undefined;
  Lightbox: { photoId: string; photoIds: string[] };
  Onboarding: undefined;
  Settings: undefined;
  AlbumDetail: { albumId: string };
  EditPanel: { photoId: string };
  People: undefined;
  Hidden: undefined;
  Favorites: undefined;
  Albums: undefined;
  Slideshow: { photoIds: string[] };
  Collage: { photoIds: string[] };
  VersionHistory: { photoId: string };
  StorageDashboard: undefined;
  SearchResults: { query: string };
  Compare: { photoId: string; photoIds: string[] };
  FaceGroupDetail: { groupId: string };
};

export type MainTabParamList = {
  GridTab: undefined;
  TimelineTab: undefined;
  MapTab: undefined;
  CategoryTab: undefined;
  TrashTab: undefined;
};

// ---- 手势/Memo 卡片 ----
export interface MemoryPhoto {
  id: string;
  photoId: string;
  title: string;
  subtitle: string;
  date: string;
}
