# MiMo 相册 — React Native 项目总览

**111 源文件 · 11970 行 TypeScript · strict 模式 · 零编译错误**

## 技术栈

| 层 | 技术 | 版本 |
|---|------|------|
| 框架 | React Native (New Architecture) | 0.85.3 |
| 语言 | TypeScript (strict) | 5.9.3 |
| 导航 | React Navigation (native-stack + bottom-tabs) | 7.x |
| 状态管理 | Zustand (5 切片) | latest |
| UI 组件库 | react-native-paper (MD3) | latest |
| 动画 | react-native-reanimated | 3.x |
| 手势 | react-native-gesture-handler | 2.x |
| 数据库 | WatermelonDB (SQLite) | Phase 2 接入 |
| KV 存储 | react-native-mmkv | Phase 2 接入 |
| 图标 | react-native-vector-icons | 10.x |
| AI 推理 | Google ML Kit + TFLite | Phase 4 接入 |

## 项目结构

```
MiMoApp/
├── App.tsx                          # GestureHandler → SafeArea → Paper → Theme → Navigation
├── index.js                         # RN 入口
├── babel.config.js                  # reanimated plugin
├── tsconfig.json                    # strict + baseUrl paths
├── package.json
├── PROJECT_OVERVIEW.md              # 本文件
├── src/
│   ├── types/
│   │   └── index.ts                 # Photo, Album, ExifData, EditState, AiAnalysisResult...
│   ├── store/
│   │   ├── index.ts                 # barrel
│   │   ├── photoStore.ts            # CRUD + 筛选 + 排序 + 多选 + 批量操作
│   │   ├── albumStore.ts            # CRUD + 智能相册规则引擎
│   │   ├── uiStore.ts               # Toast / Modal / Overlay / FAB / search
│   │   ├── settingsStore.ts         # 主题 / 列数 / PIN / 搜索历史
│   │   └── aiStore.ts               # AI 管线状态 + 结果 Map
│   ├── db/
│   │   ├── index.ts                 # barrel
│   │   ├── schema.ts                # WatermelonDB 7 表 schema
│   │   ├── database.ts              # IDatabase 接口 + MockDatabase 实现
│   │   ├── migrations.ts            # 迁移框架
│   │   └── models/
│   │       ├── index.ts             # barrel
│   │       ├── Photo.ts             # photoToRecord / recordToPhoto
│   │       ├── Album.ts             # albumToRecord / recordToAlbum
│   │       └── FaceGroup.ts         # FaceGroup 序列化
│   ├── navigation/
│   │   ├── index.ts                 # barrel
│   │   ├── types.ts                 # 导航参数工具类型
│   │   ├── RootNavigator.tsx        # Lock → Onboarding → Main(5 tabs) → 15 子页面
│   │   └── TabNavigator.tsx         # 5 标签底部导航
│   ├── screens/                     # 23 个屏幕
│   │   ├── GridScreen.tsx           # ✅ 网格 + 搜索 + 筛选 + 选择 + FAB + 4 覆盖层
│   │   ├── LockScreen.tsx           # ✅ 4 位 PIN 键盘 + 错误动画
│   │   ├── OnboardingScreen.tsx     # ✅ 3 页引导 + 页面指示器
│   │   ├── LightboxScreen.tsx       # ✅ FlatList 水平滑动 + PinchZoom + EXIF 信息卡
│   │   ├── TimelineScreen.tsx       # ✅ 按月分组 + sticky headers + 行布局
│   │   ├── MapScreen.tsx            # ✅ 地点聚合列表 + 缩略图
│   │   ├── CategoryScreen.tsx       # ✅ 按 AI 分类聚合 + 每类内行布局
│   │   ├── TrashScreen.tsx          # ✅ 恢复/彻底删除/清空 + 30天倒计时
│   │   ├── EditPanelScreen.tsx      # ✅ 4 标签编辑器（调整/滤镜/裁剪/标注）+ 版本保存
│   │   ├── SettingsScreen.tsx       # ✅ 全页：主题/列数/PIN/生物/关于
│   │   ├── AlbumDetailScreen.tsx    # ✅ 相册内照片网格
│   │   ├── AlbumsScreen.tsx         # ✅ 相册列表 + 创建对话框
│   │   ├── PeopleScreen.tsx         # 人物聚类（stub）
│   │   ├── HiddenScreen.tsx         # ✅ 隐藏照片网格 + 取消隐藏
│   │   ├── FavoritesScreen.tsx      # ✅ 收藏照片网格
│   │   ├── SlideshowScreen.tsx      # ✅ Ken Burns 动画幻灯片 + 播放/暂停
│   │   ├── CollageScreen.tsx        # ✅ 拼图制作（2-9 张，间距/圆角可调）
│   │   ├── VersionHistoryScreen.tsx # ✅ 编辑版本历史浏览/恢复/删除
│   │   ├── StorageDashboardScreen.tsx # ✅ 存储统计 + 分类占用 + 清理建议
│   │   └── SearchResultsScreen.tsx  # 🔜 语义搜索结果页
│   ├── components/
│   │   ├── photo/
│   │   │   ├── PhotoCard.tsx        # 标签/收藏/选中遮罩/memo
│   │   │   ├── PhotoGrid.tsx        # FlatList numColumns + 动态卡尺寸
│   │   │   └── DateGroupHeader.tsx  # 月份分组头
│   │   ├── lightbox/
│   │   │   ├── LightboxImage.tsx    # 捏合缩放 + 双击 + 拖拽关闭 (reanimated)
│   │   │   ├── LightboxFooter.tsx   # 元数据 + 编辑/收藏/分享/删除按钮
│   │   │   ├── ExifCard.tsx         # EXIF 信息网格（11 个字段）
│   │   │   └── EditPanel/
│   │   │       ├── AdjustTab.tsx    # 亮度/对比度/饱和度 (−/+ 按钮)
│   │   │       ├── FilterTab.tsx    # 8 种滤镜预设（暖色/冷色/黑白...）
│   │   │       ├── CropTab.tsx      # 5 种裁切比例 + 旋转按钮
│   │   │       └── DrawTab.tsx      # 8 色 + 4 笔刷大小 + 清除/保存
│   │   ├── search/
│   │   │   ├── SearchBar.tsx        # 搜索栏 + 取消按钮
│   │   │   ├── SearchSuggestions.tsx # 搜索历史 + 推荐查询
│   │   │   └── SemanticChips.tsx    # 查询解析芯片（时间/地点/内容）
│   │   ├── filter/
│   │   │   ├── FilterRow.tsx        # 分类 + 收藏筛选滚动条
│   │   │   └── FilterChip.tsx       # MD3 chip
│   │   ├── overlays/
│   │   │   ├── AiOverlay.tsx        # AI 管线进度条 + 开始/暂停
│   │   │   ├── DedupOverlay.tsx     # 去重扫描 + 相似度 + 标记
│   │   │   ├── StatsModal.tsx       # 照片统计 + 分类分布
│   │   │   └── SettingsModal.tsx    # 主题/列数/PIN/生物/FAB 开关
│   │   ├── albums/
│   │   │   ├── AlbumCreateDialog.tsx # 创建相册弹窗
│   │   │   ├── AlbumChipMenu.tsx    # 底部列表添加到相册（支持批量）
│   │   │   ├── AlbumDropZone.tsx    # 拖放照片到相册 drop targets
│   │   │   ├── PhotoPickerDialog.tsx # 多选照片弹窗
│   │   │   └── SmartAlbumDialog.tsx  # 创建智能相册弹窗
│   │   ├── fab/
│   │   │   ├── FabButton.tsx        # FAB 项
│   │   │   └── FabMenu.tsx          # 导入/AI/去重 浮动菜单
│   │   ├── gestures/
│   │   │   ├── index.ts             # barrel
│   │   │   ├── SwipeablePhotoCard.tsx # 左右滑动（收藏/删除）
│   │   │   ├── PinchGridResize.ts   # 捏合缩放网格列数
│   │   │   └── SwipeSelect.ts       # 滑动批量选择
│   │   └── shared/
│   │       ├── Toolbar.tsx          # 标题栏 + 返回按钮 + actions
│   │       ├── Toast.tsx            # Toast 队列 + 自动消失
│   │       ├── EmptyState.tsx       # 图标 + 标题 + 副标题空状态
│   │       ├── ContextMenu.tsx      # 长按弹出菜单
│   │       ├── PeekOverlay.tsx      # 模态预览卡片 + 快速操作
│   │       └── MemoryCard.tsx       # "那年今天" 卡片
│   ├── theme/
│   │   └── index.tsx                # 5 套配色 + ThemeProvider + useAppTheme
│   ├── hooks/
│   │   ├── index.ts                 # barrel
│   │   ├── useAppInit.ts            # 启动初始化（设置 + mock 数据）
│   │   ├── usePhotos.ts             # 筛选/排序/分组（month/location）
│   │   ├── useSemanticSearch.ts     # 中文 NLU 自然语言搜索
│   │   └── useMemoryPhotos.ts       # "那年今天"
│   ├── ai/
│   │   ├── index.ts                 # barrel
│   │   ├── pipeline.ts              # IAiProcessor 插件式管线
│   │   ├── dedup.ts                 # pHash + 汉明距离相似度
│   │   ├── nlu/parser.ts            # 中文意图解析（时间/地点/关键字/分类）
│   │   └── embedding/index.ts       # TFLite 嵌入接口 + 余弦相似度
│   ├── utils/
│   │   ├── index.ts                 # barrel
│   │   ├── image.ts                 # 缩略图/主色/文件大小
│   │   ├── exif.ts                  # EXIF 解析
│   │   ├── date.ts                  # 日期格式化（相对/绝对）
│   │   ├── collages.ts              # 拼图布局算法
│   │   ├── mockData.ts              # 24 张模拟照片生成器
│   │   └── constants.ts             # 常量 + 主题名 + 分类标签 + emoji
```

## 数据模型（核心）

```typescript
interface Photo {
  id: string; uri: string; thumbnailUri?: string;
  filename: string; sizeBytes: number; width: number; height: number;
  createdAt: number; dateTaken: string; timeTaken: string;
  latitude: number | null; longitude: number | null; locationName: string | null;
  exif: ExifData; color: string;
  isFavorite: boolean; isHidden: boolean; isPinned: boolean; isDeleted: boolean;
  aiTags: string[] | null; aiCategory: Category | null; faceCount: number | null;
  phash: string | null; embedding: number[] | null; duplicateOfId: string | null;
  edits: EditState; versions: EditVersion[]; rating: number;
}
```

## 导航结构

```
RootStack (NativeStackNavigator)
├── Lock          → LockScreen ✅
├── Onboarding    → OnboardingScreen ✅
├── Main          → TabNavigator (BottomTabs)
│   ├── GridTab       → GridScreen ✅ (含 4 个覆盖层)
│   ├── TimelineTab   → TimelineScreen ✅
│   ├── MapTab        → MapScreen ✅
│   ├── CategoryTab   → CategoryScreen ✅
│   └── TrashTab      → TrashScreen ✅
├── Lightbox      → LightboxScreen ✅ (捏合缩放 + 滑动)
├── EditPanel     → EditPanelScreen ✅ (调整/滤镜/裁剪/标注)
├── Settings      → SettingsScreen ✅
├── AlbumDetail   → AlbumDetailScreen ✅
├── Albums        → AlbumsScreen ✅
├── People        → PeopleScreen (stub)
├── Hidden        → HiddenScreen ✅
├── Favorites     → FavoritesScreen ✅
├── Slideshow     → SlideshowScreen ✅ (Ken Burns)
├── Collage       → CollageScreen ✅
├── VersionHistory → VersionHistoryScreen ✅
├── StorageDashboard → StorageDashboardScreen ✅
└── SearchResults → 🔜 待添加
```

## Store 接口速查

| Store | 关键 state | 关键 actions |
|-------|-----------|-------------|
| `photoStore` | photos[], filter, sortMode, selectedIds, isGridReady | setPhotos, updatePhoto, batchFavorite/Delete/Hide, getFilteredPhotos() |
| `albumStore` | albums[] | createAlbum, createSmartAlbum, addToAlbum, removeFromAlbum |
| `uiStore` | toasts[], isFabOpen, gridColumns, modals | showToast, toggleFab, set*Visible() |
| `settingsStore` | theme, gridColumns, pinEnabled, pinCode | setTheme, setGridColumns, setPin, load/persist |
| `aiStore` | status (isRunning, queueSize, ...), results Map | startPipeline, reportResult, reportError |

## 后期修改接口速查

| 修改需求 | 目标文件 | 方法 |
|---------|---------|------|
| 新增主题配色 | `theme/index.tsx` → `SCHEME_SOURCES` | 加一行 { light, dark } 色源 |
| 新增照片属性 | `types/index.ts` → `Photo` | 加字段 |
| 替换数据库 | `db/database.ts` | `setDatabase(new RealDB())` — 接口不变 |
| 接入真实 AI | `ai/pipeline.ts` | 注册 IAiProcessor |
| 新增标签页 | `navigation/TabNavigator.tsx` | 加 Tab.Screen |
| 新增路由 | `types/index.ts` → RootNavigator | 加 ParamList + Screen |
| 替换持久化 | `store/settingsStore.ts` | 改 loadSettings/persistSettings 内部 |
| 新增筛选维度 | `store/photoStore.ts` | PhotoFilter + getFilteredPhotos() |
| 新增分类 emoji | `utils/constants.ts` → `CATEGORY_EMOJI` | 加一行 |

## AI 对标

| Web 模拟 | React Native 真实实现 |
|---------|---------------------|
| MobileNet 分类 | ML Kit Image Labeling（400+ 类别） |
| face-api.js | ML Kit Face Detection（特征点 + 描述符） |
| CLIP 嵌入 | TFLite MobileCLIP → 语义搜索 |
| 感知哈希模拟 | TS 原生实现（pHash + 汉明距离） |
| 中文 NLU | 同逻辑移植（正则 + 关键词） |
| setTimeout 模拟 | react-native-background-fetch 空闲处理 |

## 开发阶段

| 阶段 | 内容 | 状态 |
|------|------|------|
| Phase 0 | 框架搭建 + TS 类型 + 接口设计 | ✅ 完成 |
| Phase 1 | 导航 + 5 Store + 主题 + 20 屏幕 + 28 组件 + 4 hooks | ✅ 完成 |
| Phase 2 | 真实照片（相机/相册/EXIF/Lightbox 增强） | 进行中 |
| Phase 3 | 相册/搜索/高级功能 | 进行中 |
| Phase 4 | 本地 AI（ML Kit + TFLite） | 待开发 |
| Phase 5 | 打磨（动画/性能/无障碍） | 待开发 |

## 运行

```bash
cd MiMoApp
npm install        # 已完成（908 包）
npx react-native run-android  # 需要 Android SDK
```

## 设计原则

- **接口隔离**：每个模块通过明确的 TS 接口暴露，实现可整体替换
- **单一职责**：Store 切片独立；组件纯展示 vs 容器分离
- **依赖倒置**：IDatabase → MockDB/MelonDB；IAiProcessor → ML Kit/TFLite
- **最少影响**：修改通常只影响单个文件，跨模块通过 barrel index
