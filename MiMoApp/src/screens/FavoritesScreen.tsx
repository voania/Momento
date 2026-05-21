import React, { useMemo, useCallback } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useMd3Theme } from '../theme';
import { usePhotoStore, useUiStore } from '../store';
import type { RootStackScreenProps } from '../navigation/types';
import { Toolbar } from '../components/shared/Toolbar';
import { PhotoCard } from '../components/photo/PhotoCard';
import { EmptyState } from '../components/shared/EmptyState';
import type { Photo } from '../types';

export function FavoritesScreen({ navigation }: RootStackScreenProps<'Favorites'>) {
  const theme = useMd3Theme();
  const photos = usePhotoStore((s) => s.photos);
  const screenWidth = Dimensions.get('window').width;
  const cols = 3;
  const gap = 2;
  const cardSize = Math.floor((screenWidth - gap * 2 - gap * (cols - 1)) / cols);

  const favorites = useMemo(
    () => photos.filter((p) => !p.isDeleted && p.isFavorite),
    [photos],
  );

  const handlePress = useCallback(
    (photoId: string) => {
      navigation.navigate('Lightbox', {
        photoId,
        photoIds: favorites.map((p) => p.id),
      });
    },
    [favorites, navigation],
  );

  const rows = useMemo(() => {
    const result: Photo[][] = [];
    for (let i = 0; i < favorites.length; i += cols) {
      result.push(favorites.slice(i, i + cols));
    }
    return result;
  }, [favorites]);

  if (favorites.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Toolbar title="收藏" showBack onBack={() => navigation.goBack()} />
        <EmptyState icon="♥" title="还没有收藏" subtitle="在照片上点按收藏即可出现在这里" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Toolbar title="收藏" subtitle={`${favorites.length} 张`} showBack onBack={() => navigation.goBack()} />
      <FlatList
        data={rows}
        keyExtractor={(_, idx) => `fav-${idx}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: row }) => (
          <View style={[styles.row, { gap }]}>
            {row.map((p) => (
              <PhotoCard key={p.id} photo={p} size={cardSize} onPress={handlePress} />
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingHorizontal: 2, paddingBottom: 80 },
  row: { flexDirection: 'row', marginBottom: 2 },
});
