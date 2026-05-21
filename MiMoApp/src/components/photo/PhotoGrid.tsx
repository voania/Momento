import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import { useSettingsStore } from '../../store';
import { PhotoCard } from './PhotoCard';
import type { Photo } from '../../types';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoPress: (photoId: string) => void;
  onPhotoLongPress?: (photoId: string) => void;
  selectedIds?: Set<string>;
  gap?: number;
  padding?: number;
}

export function PhotoGrid({
  photos,
  onPhotoPress,
  onPhotoLongPress,
  selectedIds,
  gap = 2,
  padding = 2,
}: PhotoGridProps) {
  const { width: screenWidth } = useWindowDimensions();
  const gridColumns = useSettingsStore((s) => s.gridColumns);

  // 计算卡片尺寸（动态响应列数变化）
  const cardSize = useMemo(() => {
    const totalGap = gap * (gridColumns - 1) + padding * 2;
    return Math.floor((screenWidth - totalGap) / gridColumns);
  }, [screenWidth, gridColumns, gap, padding]);

  const renderItem = ({ item }: { item: Photo }) => (
    <PhotoCard
      photo={item}
      size={cardSize}
      selected={selectedIds?.has(item.id)}
      onPress={onPhotoPress}
      onLongPress={onPhotoLongPress}
    />
  );

  return (
    <FlatList
      data={photos}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={gridColumns}
      key={`grid-${gridColumns}`} // 列数变化时强制重新渲染（触发 FLIP 动画）
      contentContainerStyle={{ padding }}
      columnWrapperStyle={gridColumns > 1 ? { gap } : undefined}
      ItemSeparatorComponent={() => <View style={{ height: gap }} />}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      maxToRenderPerBatch={15}
      windowSize={5}
      getItemLayout={(_, index) => {
        const row = Math.floor(index / gridColumns);
        const offset = row * (cardSize + gap) + padding;
        return { length: cardSize + gap, offset, index };
      }}
    />
  );
}
