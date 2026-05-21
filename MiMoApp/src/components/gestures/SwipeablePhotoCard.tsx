import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder } from 'react-native';
import { useMd3Theme } from '../../theme';
import { PhotoCard } from '../photo/PhotoCard';
import type { Photo } from '../../types';

// ============================================================
// SwipeablePhotoCard — 右滑收藏 / 左滑删除
// ============================================================

interface SwipeablePhotoCardProps {
  photo: Photo;
  size: number;
  onPress: (photoId: string) => void;
  onFavorite: (photoId: string) => void;
  onDelete: (photoId: string) => void;
}

const SWIPE_THRESHOLD = 60;

export function SwipeablePhotoCard({
  photo,
  size,
  onPress,
  onFavorite,
  onDelete,
}: SwipeablePhotoCardProps) {
  const theme = useMd3Theme();
  const translateX = React.useRef(new Animated.Value(0)).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 10 && Math.abs(gs.dx) > Math.abs(gs.dy) * 2,
      onPanResponderMove: (_, gs) => {
        translateX.setValue(gs.dx * 0.6);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dx > SWIPE_THRESHOLD) {
          // 右滑 → 收藏
          Animated.spring(translateX, {
            toValue: size,
            useNativeDriver: true,
          }).start(() => {
            onFavorite(photo.id);
            translateX.setValue(0);
          });
        } else if (gs.dx < -SWIPE_THRESHOLD) {
          // 左滑 → 删除
          Animated.spring(translateX, {
            toValue: -size,
            useNativeDriver: true,
          }).start(() => {
            onDelete(photo.id);
            translateX.setValue(0);
          });
        } else {
          // 归位
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      {/* 右滑背景 — 收藏 */}
      <View style={[styles.actionBg, styles.favBg, { backgroundColor: theme.colors.primaryContainer }]}>
        <Text style={[styles.actionIcon, { color: theme.colors.primary }]}>♥</Text>
      </View>

      {/* 左滑背景 — 删除 */}
      <View style={[styles.actionBg, styles.delBg, { backgroundColor: theme.colors.errorContainer }]}>
        <Text style={[styles.actionIcon, { color: theme.colors.error }]}>🗑</Text>
      </View>

      {/* 前景卡片 */}
      <Animated.View
        style={{ transform: [{ translateX }] }}
        {...panResponder.panHandlers}
      >
        <PhotoCard photo={photo} size={size} onPress={onPress} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative', overflow: 'hidden', borderRadius: 12 },
  actionBg: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  favBg: { left: 0, paddingRight: '60%' as any },
  delBg: { right: 0, paddingLeft: '60%' as any },
  actionIcon: { fontSize: 24 },
});
