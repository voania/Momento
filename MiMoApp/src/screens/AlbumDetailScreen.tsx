import React, { useMemo, useCallback } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useMd3Theme } from '../theme';
import { useAlbumStore, usePhotoStore } from '../store';
import type { RootStackScreenProps } from '../navigation/types';
import { Toolbar } from '../components/shared/Toolbar';
import { PhotoCard } from '../components/photo/PhotoCard';
import { EmptyState } from '../components/shared/EmptyState';
import type { Photo } from '../types';

export function AlbumDetailScreen({ route, navigation }: RootStackScreenProps<'AlbumDetail'>) {
  const { albumId } = route.params;
  const theme = useMd3Theme();
  const album = useAlbumStore((s) => s.albums.find((a) => a.id === albumId));
  const photos = usePhotoStore((s) => s.photos);
  const screenWidth = Dimensions.get('window').width;
  const cols = 3;
  const gap = 2;
  const cardSize = Math.floor((screenWidth - gap * 2 - gap * (cols - 1)) / cols);

  const albumPhotos = useMemo(() => {
    if (!album) return [];
    return album.photoIds
      .map((id) => photos.find((p) => p.id === id))
      .filter(Boolean) as Photo[];
  }, [album, photos]);

  const handlePress = useCallback(
    (photoId: string) => {
      navigation.navigate('Lightbox', {
        photoId,
        photoIds: albumPhotos.map((p) => p.id),
      });
    },
    [albumPhotos, navigation],
  );

  if (!album) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Toolbar title="相册" showBack onBack={() => navigation.goBack()} />
        <EmptyState title="相册不存在" />
      </View>
    );
  }

  const rows = (() => {
    const result: Photo[][] = [];
    for (let i = 0; i < albumPhotos.length; i += cols) {
      result.push(albumPhotos.slice(i, i + cols));
    }
    return result;
  })();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Toolbar
        title={album.name}
        subtitle={`${album.photoCount} 张${album.isSmart ? ' · 智能相册' : ''}`}
        showBack
        onBack={() => navigation.goBack()}
      />
      {albumPhotos.length === 0 ? (
        <EmptyState icon="📸" title="相册为空" subtitle="点击 + 添加照片到相册" />
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(_, idx) => `ad-${idx}`}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingHorizontal: 2, paddingBottom: 80 },
  row: { flexDirection: 'row', marginBottom: 2 },
});
