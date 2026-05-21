import React, { useMemo, useCallback } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useMd3Theme } from '../theme';
import { usePhotosGroupedByMonth } from '../hooks/usePhotos';
import type { TabScreenProps } from '../navigation/types';
import { Toolbar } from '../components/shared/Toolbar';
import { PhotoCard } from '../components/photo/PhotoCard';
import { DateGroupHeader } from '../components/photo/DateGroupHeader';
import { EmptyState } from '../components/shared/EmptyState';
import type { Photo } from '../types';

type TimelineItem =
  | { type: 'header'; month: string; count: number }
  | { type: 'row'; photos: Photo[] };

export function TimelineScreen({ navigation }: TabScreenProps<'TimelineTab'>) {
  const theme = useMd3Theme();
  const grouped = usePhotosGroupedByMonth();
  const screenWidth = Dimensions.get('window').width;
  const cols = 3;
  const gap = 2;
  const cardSize = Math.floor((screenWidth - gap * 2 - gap * (cols - 1)) / cols);

  const handlePhotoPress = useCallback(
    (photoId: string) => {
      const allIds = grouped.flatMap((g) => g.items.map((p) => p.id));
      navigation.navigate('Lightbox', { photoId, photoIds: allIds });
    },
    [grouped, navigation],
  );

  // 展开为 header + rows（每行最多 cols 张）
  const flatData = useMemo(() => {
    const result: TimelineItem[] = [];
    for (const g of grouped) {
      result.push({ type: 'header', month: g.month, count: g.items.length });
      for (let i = 0; i < g.items.length; i += cols) {
        result.push({ type: 'row', photos: g.items.slice(i, i + cols) });
      }
    }
    return result;
  }, [grouped]);

  const stickyIndices = useMemo(() => {
    const indices: number[] = [];
    flatData.forEach((item, i) => {
      if (item.type === 'header') indices.push(i);
    });
    return indices;
  }, [flatData]);

  if (grouped.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Toolbar title="时间线" />
        <EmptyState icon="📅" title="还没有照片" subtitle="导入照片后按时间线浏览" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Toolbar title="时间线" />
      <FlatList
        data={flatData}
        keyExtractor={(item, idx) =>
          item.type === 'header' ? `h-${item.month}` : `r-${idx}`
        }
        stickyHeaderIndices={stickyIndices}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return <DateGroupHeader month={item.month} count={item.count} />;
          }
          return (
            <View style={[styles.row, { gap }]}>
              {item.photos.map((p) => (
                <PhotoCard
                  key={p.id}
                  photo={p}
                  size={cardSize}
                  onPress={handlePhotoPress}
                />
              ))}
              {/* 填充空位保持左对齐 */}
              {item.photos.length < cols &&
                Array.from({ length: cols - item.photos.length }).map((_, i) => (
                  <View key={`ph-${i}`} style={{ width: cardSize, height: cardSize }} />
                ))}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: 80 },
  row: { flexDirection: 'row', paddingHorizontal: 2, marginBottom: 2 },
});
