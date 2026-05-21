import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMd3Theme } from '../theme';
import { usePhotoStore, useUiStore } from '../store';
import type { RootStackScreenProps } from '../navigation/types';
import { LightboxImage } from '../components/lightbox/LightboxImage';
import { LightboxFooter } from '../components/lightbox/LightboxFooter';
import { ExifCard } from '../components/lightbox/ExifCard';
import { ExifEditor } from '../components/lightbox/ExifEditor';
import { PhotoActionSheet } from '../components/overlays/PhotoActionSheet';
import type { Photo } from '../types';

export function LightboxScreen({ route, navigation }: RootStackScreenProps<'Lightbox'>) {
  const { photoId, photoIds } = route.params;
  const theme = useMd3Theme();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const updatePhoto = usePhotoStore((s) => s.updatePhoto);
  const showToast = useUiStore((s) => s.showToast);
  const photos = usePhotoStore((s) => s.photos);

  const [isUiVisible, setIsUiVisible] = useState(true);
  const [showExif, setShowExif] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showExifEditor, setShowExifEditor] = useState(false);
  const initialIndex = Math.max(photoIds.indexOf(photoId), 0);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // 当前索引对应的照片 ID 列表
  const currentPhotoId = photoIds[currentIndex];
  const currentPhoto = photos.find((p) => p.id === currentPhotoId);
  const photoList = photoIds.map((id) => photos.find((p) => p.id === id)).filter(Boolean) as Photo[];

  const toggleUi = useCallback(() => {
    setIsUiVisible((v) => !v);
  }, []);

  const handleFavorite = useCallback(() => {
    if (!currentPhoto) return;
    updatePhoto(currentPhoto.id, { isFavorite: !currentPhoto.isFavorite });
    showToast(currentPhoto.isFavorite ? '已取消收藏' : '已收藏', 'success');
  }, [currentPhoto, updatePhoto, showToast]);

  const handleDelete = useCallback(() => {
    if (!currentPhoto) return;
    updatePhoto(currentPhoto.id, { isDeleted: true, deletedAt: Date.now() });
    showToast('已移至回收站', 'info');
    if (photoIds.length <= 1) {
      navigation.goBack();
    }
  }, [currentPhoto, updatePhoto, showToast, photoIds, navigation]);

  const handleShare = useCallback(() => {
    // 后期接入 react-native Share API
    showToast('分享功能待接入', 'info');
  }, [showToast]);

  const handleEdit = useCallback(() => {
    if (!currentPhoto) return;
    navigation.navigate('EditPanel', { photoId: currentPhoto.id });
  }, [currentPhoto, navigation]);

  const handleCompare = useCallback(() => {
    navigation.navigate('Compare', { photoId: currentPhotoId, photoIds });
  }, [currentPhotoId, photoIds, navigation]);

  const handleSlideshow = useCallback(() => {
    navigation.navigate('Slideshow', { photoIds });
  }, [photoIds, navigation]);

  const handleCollage = useCallback(() => {
    navigation.navigate('Collage', { photoIds: photoIds.slice(0, 9) });
  }, [photoIds, navigation]);

  const handleVersionHistory = useCallback(() => {
    navigation.navigate('VersionHistory', { photoId: currentPhotoId });
  }, [currentPhotoId, navigation]);

  // FlatList 渲染项
  const renderItem = useCallback(
    ({ item }: { item: Photo }) => (
      <View style={{ width: screenWidth, height: '100%' }}>
        <LightboxImage
          uri={item.uri}
          color={item.color}
          onTap={toggleUi}
          onRequestClose={navigation.goBack}
        />
      </View>
    ),
    [screenWidth, toggleUi, navigation.goBack],
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: any) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      {/* 图片滑动区 */}
      <FlatList
        data={photoList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialIndex}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* 顶部栏 */}
      {isUiVisible && (
        <View style={[styles.header, { top: insets.top, paddingTop: 8 }]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.headerBtn}>
            <Text style={styles.headerIcon}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>
            {currentIndex + 1} / {photoIds.length}
          </Text>
          <Pressable onPress={() => setShowExif(!showExif)} style={styles.headerBtn}>
            <Text style={styles.headerIcon}>ℹ️</Text>
          </Pressable>
        </View>
      )}

      {/* EXIF 信息卡 */}
      {isUiVisible && showExif && currentPhoto && (
        <View style={[styles.exifOverlay, { top: insets.top + 60 }]}>
          <ExifCard exif={currentPhoto.exif} />
        </View>
      )}

      {/* 底部操作栏 */}
      {isUiVisible && currentPhoto && (
        <LightboxFooter
          photo={currentPhoto}
          currentIndex={currentIndex}
          totalCount={photoIds.length}
          onEdit={handleEdit}
          onFavorite={handleFavorite}
          onShare={handleShare}
          onDelete={handleDelete}
          onMore={() => setShowActionSheet(true)}
          onCompare={handleCompare}
          onSlideshow={handleSlideshow}
          onCollage={handleCollage}
          onVersionHistory={handleVersionHistory}
        />
      )}

      <PhotoActionSheet
        visible={showActionSheet}
        photo={currentPhoto ?? null}
        onClose={() => setShowActionSheet(false)}
        onEdit={handleEdit}
        onCompare={handleCompare}
        onExifEdit={() => {
          setShowActionSheet(false);
          setShowExifEditor(true);
        }}
      />
      {currentPhoto && (
        <ExifEditor
          visible={showExifEditor}
          photoId={currentPhoto.id}
          exif={currentPhoto.exif}
          onClose={() => setShowExifEditor(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 20,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: { color: '#fff', fontSize: 18, fontWeight: '600' },
  headerTitle: { color: '#fff', fontSize: 15, fontWeight: '500' },
  exifOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 15,
  },
});
