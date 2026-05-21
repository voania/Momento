import React, { useCallback, useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, Pressable, Text } from 'react-native';
import { useMd3Theme } from '../theme';
import { useAlbumStore } from '../store';
import type { RootStackScreenProps } from '../navigation/types';
import { Toolbar } from '../components/shared/Toolbar';
import { EmptyState } from '../components/shared/EmptyState';
import { AlbumSortBar, type AlbumSortKey } from '../components/albums/AlbumSortBar';
import type { Album } from '../types';

export function AlbumsScreen({ navigation }: RootStackScreenProps<'Albums'>) {
  const theme = useMd3Theme();
  const albums = useAlbumStore((s) => s.albums);
  const [sortKey, setSortKey] = useState<AlbumSortKey>('recent');

  const sortedAlbums = useMemo(() => {
    const list = [...albums];
    switch (sortKey) {
      case 'name':
        return list.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
      case 'count':
        return list.sort((a, b) => b.photoCount - a.photoCount);
      case 'type':
        return list.sort((a, b) => Number(a.isSmart) - Number(b.isSmart));
      case 'recent':
      default:
        return list.sort((a, b) => b.createdAt - a.createdAt);
    }
  }, [albums, sortKey]);

  const handlePress = useCallback(
    (album: Album) => {
      navigation.navigate('AlbumDetail', { albumId: album.id });
    },
    [navigation],
  );

  if (albums.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Toolbar title="相册" showBack onBack={() => navigation.goBack()} />
        <EmptyState icon="📸" title="还没有相册" subtitle='点击 + 创建手动相册或智能相册' />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Toolbar title="相册" showBack onBack={() => navigation.goBack()} />
      <AlbumSortBar activeSort={sortKey} onSortChange={setSortKey} />
      <FlatList
        data={sortedAlbums}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: album }) => (
          <Pressable
            style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}
            onPress={() => handlePress(album)}
          >
            <View style={[styles.cover, { backgroundColor: theme.colors.primaryContainer }]}>
              <Text style={styles.coverEmoji}>📸</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]} numberOfLines={1}>
                {album.name}
              </Text>
              <Text style={[styles.cardMeta, { color: theme.colors.onSurfaceVariant }]}>
                {album.photoCount} 张 · {album.isSmart ? '智能' : '手动'}
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
  listContent: { padding: 12, paddingBottom: 80 },
  card: {
    flex: 1,
    margin: 4,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cover: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverEmoji: { fontSize: 36 },
  cardBody: { padding: 12 },
  cardTitle: { fontSize: 15, fontWeight: '600' },
  cardMeta: { fontSize: 12, marginTop: 2 },
});
