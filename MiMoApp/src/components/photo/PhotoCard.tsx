import React, { memo } from 'react';
import { View, Image, Text, StyleSheet, Pressable } from 'react-native';
import { useMd3Theme } from '../../theme';
import type { Photo } from '../../types';

interface PhotoCardProps {
  photo: Photo;
  size: number;
  selected?: boolean;
  onPress: (photoId: string) => void;
  onLongPress?: (photoId: string) => void;
}

export const PhotoCard = memo(function PhotoCard({
  photo,
  size,
  selected,
  onPress,
  onLongPress,
}: PhotoCardProps) {
  const theme = useMd3Theme();

  return (
    <Pressable
      onPress={() => onPress(photo.id)}
      onLongPress={() => onLongPress?.(photo.id)}
      accessible
      accessibilityLabel={`${photo.filename}，${photo.dateTaken}`}
      accessibilityHint="点击查看大图，长按选择照片"
      accessibilityRole="image"
      accessibilityState={{ selected: selected || false }}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor: photo.color || theme.colors.surfaceVariant,
          borderRadius: 12,
        },
      ]}
    >
      {photo.thumbnailUri ? (
        <Image
          source={{ uri: photo.thumbnailUri }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.placeholder, { backgroundColor: photo.color || theme.colors.surfaceVariant }]} />
      )}

      {/* AI 标签 */}
      {photo.aiCategory && (
        <View style={[styles.badge, { backgroundColor: theme.colors.primaryContainer }]}>
          <Text style={[styles.badgeText, { color: theme.colors.onPrimaryContainer }]} numberOfLines={1}>
            {photo.aiCategory}
          </Text>
        </View>
      )}

      {/* 收藏标记 */}
      {photo.isFavorite && (
        <View style={styles.favBadge}>
          <Text style={styles.favIcon}>♥</Text>
        </View>
      )}

      {/* 选中遮罩 */}
      {selected && (
        <View style={[styles.selectedOverlay, { backgroundColor: theme.colors.primary + '66' }]}>
          <View style={[styles.checkCircle, { backgroundColor: theme.colors.primary }]}>
            <Text style={{ color: '#fff', fontSize: 14 }}>✓</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
  image: { width: '100%', height: '100%', borderRadius: 12 },
  placeholder: { width: '100%', height: '100%', borderRadius: 12 },
  badge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: { fontSize: 10, fontWeight: '600' },
  favBadge: { position: 'absolute', top: 6, right: 6 },
  favIcon: { fontSize: 14, color: '#E91E63' },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  } as any,
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
