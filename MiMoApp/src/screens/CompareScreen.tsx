import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { useMd3Theme } from '../theme';
import { usePhotoStore } from '../store';
import type { RootStackScreenProps } from '../navigation/types';
import type { Photo } from '../types';
import { formatFileSize } from '../utils/image';
import { CATEGORY_EMOJI, CATEGORY_LABELS } from '../utils/constants';
import { EmptyState } from '../components/shared/EmptyState';

// ============================================================
// CompareScreen — 并排比较两张照片
// 左右滑动切换照片，查看差异元数据
// ============================================================

type CompareMode = 'split' | 'slider' | 'diff';

export function CompareScreen({ route, navigation }: RootStackScreenProps<'Compare'>) {
  const { photoId, photoIds } = route.params;
  const theme = useMd3Theme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const photos = usePhotoStore((s) => s.photos);

  const [mode, setMode] = useState<CompareMode>('split');
  const [leftIndex, setLeftIndex] = useState(
    photoIds.findIndex((id) => id === photoId),
  );
  const [rightIndex, setRightIndex] = useState(Math.min(leftIndex + 1, photoIds.length - 1));

  const leftPhoto = photos.find((p) => p.id === photoIds[leftIndex]);
  const rightPhoto = photos.find((p) => p.id === photoIds[rightIndex]);

  const handlePrev = (side: 'left' | 'right') => {
    if (side === 'left' && leftIndex > 0) setLeftIndex(leftIndex - 1);
    if (side === 'right' && rightIndex > 0) setRightIndex(rightIndex - 1);
  };

  const handleNext = (side: 'left' | 'right') => {
    if (side === 'left' && leftIndex < photoIds.length - 1) setLeftIndex(leftIndex + 1);
    if (side === 'right' && rightIndex < photoIds.length - 1) setRightIndex(rightIndex + 1);
  };

  if (!leftPhoto || !rightPhoto) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.colors.outlineVariant }]}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={[styles.closeBtn, { color: theme.colors.primary }]}>关闭</Text>
          </Pressable>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>照片对比</Text>
          <View style={{ width: 48 }} />
        </View>
        <EmptyState icon="🖼️" title="无法比较" subtitle="请选择两张以上照片" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.outlineVariant }]}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={[styles.closeBtn, { color: theme.colors.primary }]}>关闭</Text>
        </Pressable>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>照片对比</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
        {/* 对比模式选择 */}
        <View style={styles.modeRow}>
          {([
            { key: 'split', label: '并排' },
            { key: 'slider', label: '滑动' },
            { key: 'diff', label: '详情' },
          ] as { key: CompareMode; label: string }[]).map((m) => (
            <Pressable
              key={m.key}
              style={[
                styles.modeChip,
                {
                  backgroundColor:
                    mode === m.key ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
                },
              ]}
              onPress={() => setMode(m.key)}
            >
              <Text
                style={[
                  styles.modeText,
                  {
                    color:
                      mode === m.key
                        ? theme.colors.onPrimaryContainer
                        : theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                {m.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* 照片预览区 */}
        <View style={styles.previewRow}>
          {/* 左侧 */}
          <View style={styles.side}>
            <Pressable style={styles.navBtn} onPress={() => handlePrev('left')}>
              <Text style={{ color: theme.colors.onSurface, fontSize: 24 }}>‹</Text>
            </Pressable>
            <Image
              source={{ uri: leftPhoto.thumbnailUri || leftPhoto.uri }}
              style={[styles.previewImage, { borderRadius: 12 }]}
              resizeMode="cover"
            />
            <Pressable style={styles.navBtn} onPress={() => handleNext('left')}>
              <Text style={{ color: theme.colors.onSurface, fontSize: 24 }}>›</Text>
            </Pressable>
          </View>

          {/* 右侧 */}
          {mode === 'split' && (
            <View style={styles.side}>
              <Pressable style={styles.navBtn} onPress={() => handlePrev('right')}>
                <Text style={{ color: theme.colors.onSurface, fontSize: 24 }}>‹</Text>
              </Pressable>
              <Image
                source={{ uri: rightPhoto.thumbnailUri || rightPhoto.uri }}
                style={[styles.previewImage, { borderRadius: 12 }]}
                resizeMode="cover"
              />
              <Pressable style={styles.navBtn} onPress={() => handleNext('right')}>
                <Text style={{ color: theme.colors.onSurface, fontSize: 24 }}>›</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* 属性对比表 */}
        {mode === 'diff' && (
          <View style={[styles.diffCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text style={[styles.diffTitle, { color: theme.colors.onSurface }]}>属性对比</Text>
            {compareRows.map((row) => (
              <View key={row.label} style={styles.diffRow}>
                <Text style={[styles.diffLabel, { color: theme.colors.onSurfaceVariant }]}>
                  {row.label}
                </Text>
                <Text style={[styles.diffVal, { color: theme.colors.onSurface }]}>
                  {row.get(leftPhoto)}
                </Text>
                <Text style={[styles.diffVal, { color: theme.colors.onSurface }]}>
                  {row.get(rightPhoto)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const compareRows: { label: string; get: (p: Photo) => string }[] = [
  { label: '文件名', get: (p) => p.filename },
  { label: '日期', get: (p) => p.dateTaken },
  { label: '大小', get: (p) => formatFileSize(p.sizeBytes) },
  { label: '尺寸', get: (p) => `${p.width}×${p.height}` },
  { label: '位置', get: (p) => p.locationName || '—' },
  { label: '分类', get: (p) => CATEGORY_LABELS[p.aiCategory || 'other'] || '其他' },
  { label: '标签', get: (p) => p.aiTags?.join(', ') || '—' },
  { label: '评分', get: (p) => '★'.repeat(p.rating) || '—' },
  { label: 'ISO', get: (p) => p.exif?.iso?.toString() || '—' },
  { label: '光圈', get: (p) => p.exif?.fNumber ? `f/${p.exif.fNumber}` : '—' },
  { label: '快门', get: (p) => p.exif?.exposureTime || '—' },
];

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
  },
  closeBtn: { fontSize: 15 },
  title: { fontSize: 17, fontWeight: '700' },
  body: { flex: 1, padding: 12 },
  modeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  modeChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
  modeText: { fontSize: 13, fontWeight: '600' },
  previewRow: { flexDirection: 'row', gap: 6 },
  side: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewImage: { flex: 1, aspectRatio: 1, backgroundColor: '#eee' },
  navBtn: {
    width: 32,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diffCard: { borderRadius: 16, padding: 16, marginTop: 16, marginBottom: 40 },
  diffTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
  diffRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  diffLabel: { width: 42, fontSize: 12, fontWeight: '600' },
  diffVal: { flex: 1, fontSize: 12 },
});
