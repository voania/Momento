import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, Text, FlatList, ScrollView } from 'react-native';
import { usePhotoStore, useUiStore, useSettingsStore } from '../store';
import { useMd3Theme } from '../theme';
import { useMemoryPhotos } from '../hooks/useMemoryPhotos';
import type { TabScreenProps } from '../navigation/types';
import type { Photo } from '../types';
import { PhotoGrid } from '../components/photo/PhotoGrid';
import { SearchBar } from '../components/search/SearchBar';
import { SearchSuggestions } from '../components/search/SearchSuggestions';
import { FilterRow } from '../components/filter/FilterRow';
import { FabMenu } from '../components/fab/FabMenu';
import { Toolbar } from '../components/shared/Toolbar';
import { Toast } from '../components/shared/Toast';
import { MemoryCard } from '../components/shared/MemoryCard';
import { AiOverlay } from '../components/overlays/AiOverlay';
import { DedupOverlay } from '../components/overlays/DedupOverlay';
import { StatsModal } from '../components/overlays/StatsModal';
import { SettingsModal } from '../components/overlays/SettingsModal';
import { BatchEditModal } from '../components/overlays/BatchEditModal';
import { AlbumChipMenu } from '../components/albums/AlbumChipMenu';

export function GridScreen({ navigation }: TabScreenProps<'GridTab'>) {
  const theme = useMd3Theme();
  const photos = usePhotoStore((s) => s.photos);
  const getFilteredPhotos = usePhotoStore((s) => s.getFilteredPhotos);
  const filter = usePhotoStore((s) => s.filter);
  const setFilter = usePhotoStore((s) => s.setFilter);
  const selectionMode = usePhotoStore((s) => s.selectionMode);
  const enterSelection = usePhotoStore((s) => s.enterSelection);
  const exitSelection = usePhotoStore((s) => s.exitSelection);
  const selectedIds = usePhotoStore((s) => s.selectedIds);
  const toggleSelection = usePhotoStore((s) => s.toggleSelection);
  const isSearchActive = useUiStore((s) => s.isSearchActive);
  const setSearchActive = useUiStore((s) => s.setSearchActive);
  const setStatsVisible = useUiStore((s) => s.setStatsModalVisible);
  const setSettingsVisible = useUiStore((s) => s.setSettingsModalVisible);
  const memories = useMemoryPhotos();

  const filteredPhotos = getFilteredPhotos();

  const handlePhotoPress = useCallback(
    (photoId: string) => {
      if (selectionMode) {
        toggleSelection(photoId);
        return;
      }
      const ids = filteredPhotos.map((p) => p.id);
      navigation.navigate('Lightbox', { photoId, photoIds: ids });
    },
    [filteredPhotos, navigation, selectionMode, toggleSelection],
  );

  const handlePhotoLongPress = useCallback(
    (photoId: string) => {
      if (!selectionMode) {
        enterSelection();
        toggleSelection(photoId);
      }
    },
    [selectionMode, enterSelection, toggleSelection],
  );

  const [albumMenuVisible, setAlbumMenuVisible] = useState(false);
  const [batchEditVisible, setBatchEditVisible] = useState(false);

  const handleSearchSelect = useCallback(
    (query: string) => {
      setFilter({ searchQuery: query });
      setSearchActive(false);
    },
    [setFilter, setSearchActive],
  );

  const handleSearchSubmit = useCallback(
    (query: string) => {
      setSearchActive(false);
      navigation.navigate('SearchResults', { query });
    },
    [navigation, setSearchActive],
  );

  const handleSelectionAction = useCallback(
    (action: 'collage' | 'compare' | 'slideshow' | 'album' | 'batchEdit') => {
      const ids = Array.from(selectedIds);
      if (ids.length === 0) return;
      switch (action) {
        case 'collage':
          navigation.navigate('Collage', { photoIds: ids.slice(0, 9) });
          break;
        case 'compare':
          navigation.navigate('Compare', { photoId: ids[0], photoIds: ids });
          break;
        case 'slideshow':
          navigation.navigate('Slideshow', { photoIds: ids });
          break;
        case 'album':
          setAlbumMenuVisible(true);
          return; // Don't exit selection mode
        case 'batchEdit':
          setBatchEditVisible(true);
          return; // Don't exit selection mode
      }
      exitSelection();
    },
    [selectedIds, navigation, exitSelection],
  );

  const hasActiveFilter =
    filter.category !== null ||
    filter.isFavorite !== null ||
    filter.searchQuery !== '';

  // 列表头部：搜索结果为空时显示提示 + 回忆卡片
  const ListHeader = useMemo(() => {
    const components: React.ReactElement[] = [];
    if (hasActiveFilter && filteredPhotos.length === 0) {
      components.push(
        <View key="no-results" style={[styles.noResults, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text style={{ fontSize: 32, textAlign: 'center' }}>🔍</Text>
          <Text style={[styles.noResultsText, { color: theme.colors.onSurfaceVariant }]}>
            没有找到匹配的照片
          </Text>
        </View>,
      );
    }
    if (!hasActiveFilter && memories.length > 0 && filteredPhotos.length > 0) {
      const mem = memories[0];
      const memPhoto = photos.find((p) => p.id === mem.photoId);
      components.push(
        <MemoryCard
          key={`mem-${mem.id}`}
          memory={mem}
          photoUri={memPhoto?.thumbnailUri}
          color={memPhoto?.color}
          onPress={(photoId) => {
            const ids = filteredPhotos.map((p) => p.id);
            navigation.navigate('Lightbox', { photoId, photoIds: ids });
          }}
        />,
      );
    }
    return components.length > 0 ? <View style={{ marginBottom: 8 }}>{components}</View> : null;
  }, [hasActiveFilter, filteredPhotos.length, memories, photos, theme, navigation, filteredPhotos]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Toolbar
        title={selectionMode ? `${selectedIds.size} 已选` : 'MiMo'}
        subtitle={!selectionMode && hasActiveFilter ? `${filteredPhotos.length} 张` : undefined}
        actions={
          !selectionMode ? (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable onPress={() => setStatsVisible(true)}>
                <Text style={{ fontSize: 18 }}>📊</Text>
              </Pressable>
              <Pressable onPress={() => setSettingsVisible(true)}>
                <Text style={{ fontSize: 18 }}>⚙️</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={exitSelection}>
              <Text style={{ color: theme.colors.primary, fontSize: 15, fontWeight: '600' }}>取消</Text>
            </Pressable>
          )
        }
      />

      {/* 选择模式工具栏 */}
      {selectionMode && selectedIds.size > 0 && (
        <View style={[styles.selectionBar, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.outlineVariant }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectionActions}>
            <Pressable
              style={[styles.selectionBtn, { backgroundColor: theme.colors.primaryContainer }]}
              onPress={() => handleSelectionAction('collage')}
            >
              <Text style={styles.selectionBtnIcon}>🖼️</Text>
              <Text style={[styles.selectionBtnLabel, { color: theme.colors.onPrimaryContainer }]}>拼图</Text>
            </Pressable>
            <Pressable
              style={[styles.selectionBtn, { backgroundColor: theme.colors.secondaryContainer }]}
              onPress={() => handleSelectionAction('compare')}
            >
              <Text style={styles.selectionBtnIcon}>↔️</Text>
              <Text style={[styles.selectionBtnLabel, { color: theme.colors.onSecondaryContainer }]}>对比</Text>
            </Pressable>
            <Pressable
              style={[styles.selectionBtn, { backgroundColor: theme.colors.tertiaryContainer }]}
              onPress={() => handleSelectionAction('slideshow')}
            >
              <Text style={styles.selectionBtnIcon}>▶️</Text>
              <Text style={[styles.selectionBtnLabel, { color: theme.colors.onTertiaryContainer }]}>幻灯片</Text>
            </Pressable>
            <Pressable
              style={[styles.selectionBtn, { backgroundColor: theme.colors.surfaceVariant }]}
              onPress={() => handleSelectionAction('album')}
            >
              <Text style={styles.selectionBtnIcon}>📁</Text>
              <Text style={[styles.selectionBtnLabel, { color: theme.colors.onSurfaceVariant }]}>添加到相册</Text>
            </Pressable>
            <Pressable
              style={[styles.selectionBtn, { backgroundColor: theme.colors.errorContainer }]}
              onPress={() => handleSelectionAction('batchEdit')}
            >
              <Text style={styles.selectionBtnIcon}>🏷️</Text>
              <Text style={[styles.selectionBtnLabel, { color: theme.colors.onErrorContainer }]}>批量编辑</Text>
            </Pressable>
          </ScrollView>
        </View>
      )}

      {/* 搜索模式 */}
      {isSearchActive ? (
        <View style={{ flex: 1 }}>
          <SearchBar
            isActive={true}
            onFocus={() => {}}
            onSubmit={handleSearchSubmit}
            onClose={() => {
              setSearchActive(false);
              setFilter({ searchQuery: '' });
            }}
          />
          <SearchSuggestions onSelect={handleSearchSelect} />
        </View>
      ) : (
        <>
          <SearchBar
            isActive={false}
            onFocus={() => setSearchActive(true)}
            onSubmit={handleSearchSubmit}
            onClose={() => setSearchActive(false)}
          />
          <FilterRow />
          <PhotoGrid
            photos={filteredPhotos}
            onPhotoPress={handlePhotoPress}
            onPhotoLongPress={handlePhotoLongPress}
            selectedIds={selectionMode ? selectedIds : undefined}
          />
        </>
      )}

      <FabMenu navigation={navigation} />
      <Toast />
      <AiOverlay />
      <DedupOverlay />
      <StatsModal />
      <SettingsModal />
      <AlbumChipMenu
        visible={albumMenuVisible}
        photoIds={Array.from(selectedIds)}
        onClose={() => setAlbumMenuVisible(false)}
        onDone={() => {
          setAlbumMenuVisible(false);
          exitSelection();
        }}
      />
      <BatchEditModal
        visible={batchEditVisible}
        photoIds={Array.from(selectedIds)}
        onClose={() => {
          setBatchEditVisible(false);
          exitSelection();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  selectionBar: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
  },
  selectionActions: {
    paddingHorizontal: 12,
    gap: 8,
  },
  selectionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  selectionBtnIcon: { fontSize: 14 },
  selectionBtnLabel: { fontSize: 12, fontWeight: '600' },
  noResults: {
    margin: 16,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
  },
  noResultsText: { fontSize: 15, marginTop: 8 },
});
