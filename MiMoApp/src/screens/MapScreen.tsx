import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useMd3Theme } from '../theme';
import { usePhotosGroupedByLocation } from '../hooks/usePhotos';
import type { TabScreenProps } from '../navigation/types';
import { Toolbar } from '../components/shared/Toolbar';
import { EmptyState } from '../components/shared/EmptyState';
import { PhotoCard } from '../components/photo/PhotoCard';

// ============================================================
// MapScreen — 按拍摄地点聚合
// 后期接入 react-native-maps：替换下方的卡片列表为地图视图
// ============================================================

export function MapScreen({ navigation }: TabScreenProps<'MapTab'>) {
  const theme = useMd3Theme();
  const locations = usePhotosGroupedByLocation();

  const handlePhotoPress = useCallback(
    (photoId: string) => {
      const allIds = locations.flatMap((l) => l.items.map((p) => p.id));
      navigation.navigate('Lightbox', { photoId, photoIds: allIds });
    },
    [locations, navigation],
  );

  const handleLocationPress = useCallback(
    (location: (typeof locations)[0]) => {
      if (location.items.length > 0) {
        navigation.navigate('Lightbox', {
          photoId: location.items[0].id,
          photoIds: location.items.map((p) => p.id),
        });
      }
    },
    [navigation],
  );

  if (locations.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Toolbar title="地图" />
        <EmptyState icon="🗺️" title="没有位置数据" subtitle="拍摄的照片包含 GPS 信息时会在地图上显示" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Toolbar title="地图" subtitle={`${locations.length} 个地点`} />
      {/* 地图占位（后期替换为 react-native-maps MapView + Marker + Callout） */}
      <View style={[styles.mapPlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Text style={[styles.mapPlaceholderText, { color: theme.colors.onSurfaceVariant }]}>
          🗺️ 地图视图 — 待接入 react-native-maps
        </Text>
        <Text style={[styles.mapHint, { color: theme.colors.outline }]}>
          {locations.length} 个拍摄地点 · {locations.reduce((s, l) => s + l.items.length, 0)} 张照片
        </Text>
      </View>
      {/* 地点列表 */}
      <FlatList
        data={locations}
        keyExtractor={(item) => item.location}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.locationCard, { backgroundColor: theme.colors.surfaceVariant }]}
            onPress={() => handleLocationPress(item)}
          >
            <View style={styles.locationHeader}>
              <Text style={styles.locationPin}>📍</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.locationName, { color: theme.colors.onSurface }]}>
                  {item.location}
                </Text>
                <Text style={[styles.locationCoords, { color: theme.colors.onSurfaceVariant }]}>
                  {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                </Text>
              </View>
              <Text style={[styles.locationCount, { color: theme.colors.primary }]}>
                {item.items.length} 张
              </Text>
            </View>
            {/* 前 3 张缩略图 */}
            <View style={styles.thumbRow}>
              {item.items.slice(0, 3).map((p) => (
                <PhotoCard
                  key={p.id}
                  photo={p}
                  size={72}
                  onPress={handlePhotoPress}
                />
              ))}
              {item.items.length > 3 && (
                <View style={[styles.moreThumb, { backgroundColor: theme.colors.primaryContainer }]}>
                  <Text style={[styles.moreText, { color: theme.colors.onPrimaryContainer }]}>
                    +{item.items.length - 3}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapPlaceholder: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
  },
  mapPlaceholderText: { fontSize: 15, fontWeight: '500' },
  mapHint: { fontSize: 12, marginTop: 4 },
  listContent: { padding: 16, paddingBottom: 80 },
  locationCard: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationPin: { fontSize: 20, marginRight: 8 },
  locationName: { fontSize: 15, fontWeight: '600' },
  locationCoords: { fontSize: 11, marginTop: 1 },
  locationCount: { fontSize: 14, fontWeight: '700' },
  thumbRow: { flexDirection: 'row', gap: 4 },
  moreThumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: { fontSize: 14, fontWeight: '700' },
});
