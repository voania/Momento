import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
} from 'react-native';
import { useMd3Theme } from '../../theme';
import { usePhotoStore, useUiStore } from '../../store';
import type { Photo } from '../../types';

// ============================================================
// PhotoActionSheet — 照片快捷操作底部面板
// 评分、标签、收藏、隐藏、查看详情
// ============================================================

interface PhotoActionSheetProps {
  visible: boolean;
  photo: Photo | null;
  onClose: () => void;
  onEdit?: () => void;
  onCompare?: () => void;
  onExifEdit?: () => void;
}

interface Action {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
  danger?: boolean;
}

export function PhotoActionSheet({ visible, photo, onClose, onEdit, onCompare, onExifEdit }: PhotoActionSheetProps) {
  const theme = useMd3Theme();
  const updatePhoto = usePhotoStore((s) => s.updatePhoto);
  const showToast = useUiStore((s) => s.showToast);

  const [showRating, setShowRating] = useState(false);

  if (!photo) return null;

  const handleAction = (id: string) => {
    switch (id) {
      case 'favorite':
        updatePhoto(photo.id, { isFavorite: !photo.isFavorite });
        showToast(photo.isFavorite ? '已取消收藏' : '已收藏', 'success');
        break;
      case 'hidden':
        updatePhoto(photo.id, { isHidden: !photo.isHidden });
        showToast(photo.isHidden ? '已取消隐藏' : '已隐藏', 'info');
        break;
      case 'pin':
        updatePhoto(photo.id, { isPinned: !photo.isPinned });
        showToast(photo.isPinned ? '已取消置顶' : '已置顶', 'success');
        break;
      case 'rating':
        setShowRating(true);
        return; // Don't close sheet for rating sub-menu
      case 'edit':
        onEdit?.();
        break;
      case 'compare':
        onCompare?.();
        break;
      case 'exif':
        onExifEdit?.();
        break;
    }
    onClose();
  };

  const handleRate = (rating: number) => {
    updatePhoto(photo.id, { rating });
    showToast(`已评分 ${'★'.repeat(rating)}`, 'success');
    setShowRating(false);
    onClose();
  };

  const actions: Action[] = [
    { id: 'favorite', icon: photo.isFavorite ? '❤️' : '🤍', label: photo.isFavorite ? '取消收藏' : '收藏', active: photo.isFavorite },
    { id: 'rating', icon: '⭐', label: photo.rating > 0 ? `评分 ${'★'.repeat(photo.rating)}` : '评分' },
    { id: 'hidden', icon: photo.isHidden ? '👁️' : '🙈', label: photo.isHidden ? '取消隐藏' : '隐藏', active: photo.isHidden },
    { id: 'pin', icon: '📌', label: photo.isPinned ? '取消置顶' : '置顶', active: photo.isPinned },
    { id: 'edit', icon: '✏️', label: '编辑' },
    { id: 'compare', icon: '↔️', label: '对比' },
    { id: 'exif', icon: '📋', label: '编辑 EXIF' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.handle, { backgroundColor: theme.colors.outlineVariant }]} />

          {/* 照片信息头 */}
          <View style={styles.photoHeader}>
            <View style={[styles.photoThumb, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Text style={styles.photoEmoji}>🖼️</Text>
            </View>
            <View style={styles.photoInfo}>
              <Text style={[styles.photoName, { color: theme.colors.onSurface }]} numberOfLines={1}>
                {photo.filename}
              </Text>
              <Text style={[styles.photoMeta, { color: theme.colors.onSurfaceVariant }]}>
                {photo.dateTaken} · {photo.rating > 0 ? '★'.repeat(photo.rating) : '未评分'}
              </Text>
            </View>
          </View>

          {/* 评分子面板 */}
          {showRating ? (
            <View style={styles.ratingPanel}>
              <Text style={[styles.ratingPrompt, { color: theme.colors.onSurface }]}>选择评分</Text>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Pressable key={star} onPress={() => handleRate(star)}>
                    <Text
                      style={[
                        styles.star,
                        { color: star <= photo.rating ? '#FFB300' : theme.colors.outlineVariant },
                      ]}
                    >
                      {star <= photo.rating ? '★' : '☆'}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Pressable
                style={[styles.ratingBack, { backgroundColor: theme.colors.surfaceVariant }]}
                onPress={() => setShowRating(false)}
              >
                <Text style={[styles.ratingBackText, { color: theme.colors.onSurface }]}>返回</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* 操作列表 */}
              {actions.map((action) => (
                <Pressable
                  key={action.id}
                  style={[styles.actionItem, { borderBottomColor: theme.colors.outlineVariant }]}
                  onPress={() => handleAction(action.id)}
                >
                  <Text style={styles.actionIcon}>{action.icon}</Text>
                  <Text
                    style={[
                      styles.actionLabel,
                      {
                        color: action.danger
                          ? theme.colors.error
                          : action.active
                            ? theme.colors.primary
                            : theme.colors.onSurface,
                      },
                    ]}
                  >
                    {action.label}
                  </Text>
                </Pressable>
              ))}
            </>
          )}

          {/* 取消 */}
          <Pressable
            style={[styles.cancelBtn, { backgroundColor: theme.colors.surfaceVariant }]}
            onPress={() => {
              setShowRating(false);
              onClose();
            }}
          >
            <Text style={[styles.cancelText, { color: theme.colors.onSurface }]}>取消</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000066',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  photoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc3',
  },
  photoThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  photoEmoji: { fontSize: 20 },
  photoInfo: { flex: 1 },
  photoName: { fontSize: 15, fontWeight: '600' },
  photoMeta: { fontSize: 12, marginTop: 2 },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  actionIcon: { fontSize: 20, marginRight: 14 },
  actionLabel: { fontSize: 15, fontWeight: '500' },
  ratingPanel: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  ratingPrompt: { fontSize: 15, fontWeight: '600', marginBottom: 16 },
  starRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  star: { fontSize: 36 },
  ratingBack: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 16,
  },
  ratingBackText: { fontSize: 14, fontWeight: '500' },
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelText: { fontSize: 16, fontWeight: '600' },
});
