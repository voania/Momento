import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useMd3Theme } from '../../theme';
import type { Photo } from '../../types';
import { formatFileSize } from '../../utils/image';

interface LightboxFooterProps {
  photo: Photo;
  currentIndex: number;
  totalCount: number;
  onEdit: () => void;
  onFavorite: () => void;
  onShare: () => void;
  onDelete: () => void;
  onMore: () => void;
  onCompare?: () => void;
  onSlideshow?: () => void;
  onCollage?: () => void;
  onVersionHistory?: () => void;
}

export function LightboxFooter({
  photo,
  currentIndex,
  totalCount,
  onEdit,
  onFavorite,
  onShare,
  onDelete,
  onMore,
  onCompare,
  onSlideshow,
  onCollage,
  onVersionHistory,
}: LightboxFooterProps) {
  const theme = useMd3Theme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface + 'F2' }]}>
      {/* 元数据行 */}
      <View style={styles.metaRow}>
        <View style={styles.metaLeft}>
          <Text style={[styles.filename, { color: theme.colors.onSurface }]} numberOfLines={1}>
            {photo.filename}
          </Text>
          <Text style={[styles.meta, { color: theme.colors.onSurfaceVariant }]}>
            {photo.dateTaken} · {formatFileSize(photo.sizeBytes)} · {photo.width}×{photo.height}
          </Text>
        </View>
        <Text style={[styles.counter, { color: theme.colors.onSurfaceVariant }]}>
          {currentIndex + 1}/{totalCount}
        </Text>
      </View>

      {/* 主操作栏 */}
      <View style={styles.actions}>
        <Pressable onPress={onEdit} style={styles.btn}>
          <Text style={styles.btnIcon}>✏️</Text>
          <Text style={[styles.btnLabel, { color: theme.colors.onSurface }]}>编辑</Text>
        </Pressable>
        <Pressable onPress={onFavorite} style={styles.btn}>
          <Text style={styles.btnIcon}>{photo.isFavorite ? '❤️' : '🤍'}</Text>
          <Text style={[styles.btnLabel, { color: theme.colors.onSurface }]}>收藏</Text>
        </Pressable>
        <Pressable onPress={onShare} style={styles.btn}>
          <Text style={styles.btnIcon}>↗️</Text>
          <Text style={[styles.btnLabel, { color: theme.colors.onSurface }]}>分享</Text>
        </Pressable>
        <Pressable onPress={onDelete} style={styles.btn}>
          <Text style={styles.btnIcon}>🗑️</Text>
          <Text style={[styles.btnLabel, { color: theme.colors.error }]}>删除</Text>
        </Pressable>
      </View>

      {/* 次要操作栏 */}
      {(onCompare || onSlideshow || onCollage || onVersionHistory) && (
        <View style={styles.secondaryActions}>
          {onCompare && (
            <Pressable onPress={onCompare} style={styles.smallBtn}>
              <Text style={styles.smallIcon}>↔️</Text>
              <Text style={[styles.smallLabel, { color: theme.colors.onSurfaceVariant }]}>对比</Text>
            </Pressable>
          )}
          {onSlideshow && (
            <Pressable onPress={onSlideshow} style={styles.smallBtn}>
              <Text style={styles.smallIcon}>▶️</Text>
              <Text style={[styles.smallLabel, { color: theme.colors.onSurfaceVariant }]}>幻灯片</Text>
            </Pressable>
          )}
          {onCollage && (
            <Pressable onPress={onCollage} style={styles.smallBtn}>
              <Text style={styles.smallIcon}>🖼️</Text>
              <Text style={[styles.smallLabel, { color: theme.colors.onSurfaceVariant }]}>拼图</Text>
            </Pressable>
          )}
          {onVersionHistory && (
            <Pressable onPress={onVersionHistory} style={styles.smallBtn}>
              <Text style={styles.smallIcon}>📜</Text>
              <Text style={[styles.smallLabel, { color: theme.colors.onSurfaceVariant }]}>版本</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  metaLeft: { flex: 1, marginRight: 12 },
  filename: { fontSize: 15, fontWeight: '600' },
  meta: { fontSize: 12, marginTop: 2 },
  counter: { fontSize: 13, fontWeight: '500' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#cccccc44',
  },
  btn: { alignItems: 'center', paddingHorizontal: 16 },
  btnIcon: { fontSize: 22, marginBottom: 2 },
  btnLabel: { fontSize: 11, fontWeight: '500' },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 10,
    paddingTop: 8,
  },
  smallBtn: { alignItems: 'center' },
  smallIcon: { fontSize: 16 },
  smallLabel: { fontSize: 10, fontWeight: '500' },
});
