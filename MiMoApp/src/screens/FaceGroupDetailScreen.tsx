import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useMd3Theme } from '../theme';
import { usePhotoStore } from '../store';
import { EmptyState } from '../components/shared/EmptyState';
import type { RootStackScreenProps } from '../navigation/types';
import type { Photo } from '../types';

// ============================================================
// FaceGroupDetailScreen — 人脸聚类详情
// 显示一个人脸组的所有照片 + 人脸缩略图
// ============================================================

export function FaceGroupDetailScreen({ route, navigation }: RootStackScreenProps<'FaceGroupDetail'>) {
  const { groupId } = route.params;
  const theme = useMd3Theme();
  const { width: screenWidth } = useWindowDimensions();
  const photos = usePhotoStore((s) => s.photos);

  // 找到该人脸组的所有照片（从 faceCount > 0 的照片中筛选）
  const groupPhotos = useMemo(() => {
    return photos.filter((p) => !p.isDeleted && p.faceCount && p.faceCount > 0);
  }, [photos]);

  const gridColumns = 3;
  const gap = 3;
  const cardSize = (screenWidth - 16 - gap * (gridColumns - 1)) / gridColumns;

  const handlePhotoPress = (photo: Photo) => {
    const photoIds = groupPhotos.map((p) => p.id);
    navigation.navigate('Lightbox', { photoId: photo.id, photoIds });
  };

  if (groupPhotos.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.colors.outlineVariant }]}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={[styles.closeBtn, { color: theme.colors.primary }]}>返回</Text>
          </Pressable>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>人物详情</Text>
          <View style={{ width: 48 }} />
        </View>
        <EmptyState icon="👤" title="暂无人脸数据" subtitle="运行 AI 人脸检测后显示" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.outlineVariant }]}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={[styles.closeBtn, { color: theme.colors.primary }]}>返回</Text>
        </Pressable>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          人物详情 {groupPhotos.length}张
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <FlatList
        data={groupPhotos}
        keyExtractor={(item) => item.id}
        numColumns={gridColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 80 }}
        getItemLayout={(_, index) => ({
          length: cardSize,
          offset: cardSize * Math.floor(index / gridColumns),
          index,
        })}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.card,
              {
                width: cardSize,
                height: cardSize,
                marginBottom: gap,
                marginRight: gap,
                backgroundColor: item.color || theme.colors.surfaceVariant,
                borderRadius: 10,
                overflow: 'hidden',
              },
            ]}
            onPress={() => handlePhotoPress(item)}
          >
            {item.thumbnailUri ? (
              <Image
                source={{ uri: item.thumbnailUri }}
                style={styles.thumb}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.placeholder}>👤</Text>
            )}
            {/* 人脸标记 */}
            {item.faceCount && item.faceCount > 0 && (
              <View style={[styles.faceBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.faceBadgeText}>{item.faceCount}人</Text>
              </View>
            )}
          </Pressable>
        )}
      />
    </View>
  );
}

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
  card: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumb: { width: '100%', height: '100%' },
  placeholder: { fontSize: 24 },
  faceBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  faceBadgeText: { color: '#fff', fontSize: 10, fontWeight: '600' },
});
