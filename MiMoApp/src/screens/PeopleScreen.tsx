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
import type { RootStackScreenProps } from '../navigation/types';
import { Toolbar } from '../components/shared/Toolbar';
import { EmptyState } from '../components/shared/EmptyState';

// ============================================================
// PeopleScreen — 人脸聚类概览
// 从 AI 分析结果中提取有 faceCount 的照片，
// 按 faceCount 分组展示为"人物卡片"
// 后期接入 ML Kit Face Detection 描述符聚类
// ============================================================

interface FaceGroup {
  id: string;
  thumbnailUri: string;
  photoCount: number;
  coverPhotoId: string;
}

export function PeopleScreen({ navigation }: RootStackScreenProps<'People'>) {
  const theme = useMd3Theme();
  const { width: screenWidth } = useWindowDimensions();
  const photos = usePhotoStore((s) => s.photos);

  // 从照片中提取人脸组（临时：按 faceCount 模拟分组）
  // 后期替换为 ML Kit 人脸描述符聚类
  const faceGroups = useMemo((): FaceGroup[] => {
    const withFaces = photos.filter((p) => !p.isDeleted && p.faceCount && p.faceCount > 0);
    if (withFaces.length === 0) return [];

    // 简单模拟：按 day 聚类（实际用描述符）
    const groups = new Map<string, typeof withFaces>();
    for (const p of withFaces) {
      const day = p.dateTaken.slice(0, 10); // YYYY-MM-DD
      if (!groups.has(day)) groups.set(day, []);
      groups.get(day)!.push(p);
    }

    return Array.from(groups.entries()).map(([day, groupPhotos], idx) => ({
      id: `face-${idx}`,
      thumbnailUri: groupPhotos[0].thumbnailUri || groupPhotos[0].uri,
      photoCount: groupPhotos.length,
      coverPhotoId: groupPhotos[0].id,
    }));
  }, [photos]);

  const numColumns = 3;
  const gap = 8;
  const cardSize = (screenWidth - 32 - gap * (numColumns - 1)) / numColumns;

  if (faceGroups.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Toolbar title="人物" showBack onBack={() => navigation.goBack()} />
        <EmptyState
          icon="👤"
          title="人物聚类"
          subtitle="AI 人脸识别后自动按人脸分组，需要拍摄包含人物的照片"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Toolbar title={`人物 (${faceGroups.length}组)`} showBack onBack={() => navigation.goBack()} />

      <FlatList
        data={faceGroups}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.card,
              {
                width: cardSize,
                marginBottom: gap,
                marginRight: gap,
                backgroundColor: theme.colors.surfaceVariant,
                borderRadius: 16,
                overflow: 'hidden',
              },
            ]}
            onPress={() => navigation.navigate('FaceGroupDetail', { groupId: item.id })}
          >
            <Image
              source={{ uri: item.thumbnailUri }}
              style={[styles.thumb, { width: cardSize, height: cardSize }]}
              resizeMode="cover"
            />
            <View style={[styles.caption, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Text style={[styles.count, { color: theme.colors.onSurface }]}>
                {item.photoCount} 张
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { alignItems: 'center' },
  thumb: { backgroundColor: '#eee' },
  caption: {
    width: '100%',
    paddingVertical: 8,
    alignItems: 'center',
  },
  count: { fontSize: 13, fontWeight: '600' },
});
