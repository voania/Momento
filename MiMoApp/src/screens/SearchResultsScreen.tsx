import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useMd3Theme } from '../theme';
import { usePhotoStore } from '../store';
import { useSemanticSearch } from '../hooks/useSemanticSearch';
import { SemanticChips } from '../components/search/SemanticChips';
import { EmptyState } from '../components/shared/EmptyState';
import { formatFileSize } from '../utils/image';
import type { RootStackScreenProps } from '../navigation/types';
import type { Photo } from '../types';

export function SearchResultsScreen({ route, navigation }: RootStackScreenProps<'SearchResults'>) {
  const { query } = route.params;
  const theme = useMd3Theme();
  const { width: screenWidth } = useWindowDimensions();
  const gridColumns = 3;
  const gap = 3;
  const cardSize = (screenWidth - 16 - gap * (gridColumns - 1)) / gridColumns;

  const { search } = useSemanticSearch();
  const results = useMemo(() => search(query), [query, search]);

  const handlePhotoPress = (photo: Photo) => {
    const photoIds = results.map((p) => p.id);
    navigation.navigate('Lightbox', { photoId: photo.id, photoIds });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.outlineVariant }]}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={[styles.closeBtn, { color: theme.colors.primary }]}>返回</Text>
        </Pressable>
        <Text style={[styles.title, { color: theme.colors.onSurface }]} numberOfLines={1}>
          搜索: {query}
        </Text>
        <View style={{ width: 48 }} />
      </View>

      {/* Semantic chips */}
      <SemanticChips
        query={query}
        onRemoveChip={() => {}}
      />

      {/* Results count */}
      <View style={styles.countRow}>
        <Text style={[styles.count, { color: theme.colors.onSurfaceVariant }]}>
          找到 {results.length} 张照片
        </Text>
      </View>

      {/* Grid */}
      {results.length === 0 ? (
        <EmptyState icon="🔍" title="未找到匹配照片" subtitle={`未找到与"${query}"相关的照片`} />
      ) : (
        <FlatList
          data={results}
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
                  marginLeft: 0,
                  marginBottom: gap,
                  marginRight: gap,
                  backgroundColor: item.color || theme.colors.surfaceVariant,
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
                <Text style={styles.placeholder}>📷</Text>
              )}
              {item.isFavorite && (
                <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
                  <Text style={styles.badgeText}>♥</Text>
                </View>
              )}
            </Pressable>
          )}
        />
      )}
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
  title: { fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'center' },
  countRow: { paddingHorizontal: 16, paddingVertical: 8 },
  count: { fontSize: 13 },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumb: { width: '100%', height: '100%' },
  placeholder: { fontSize: 24 },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10 },
});
