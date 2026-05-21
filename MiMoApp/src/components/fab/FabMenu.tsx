import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useMd3Theme } from '../../theme';
import { usePhotoStore, useUiStore, useSettingsStore } from '../../store';
import { FabButton } from './FabButton';
import { ImportProgressModal } from '../overlays/ImportProgressModal';
import type { TabScreenProps } from '../../navigation/types';

interface FabAction {
  id: string;
  icon: string;
  label: string;
  onPress: () => void;
}

export function FabMenu({ navigation }: { navigation: TabScreenProps<'GridTab'>['navigation'] }) {
  const theme = useMd3Theme();
  const isFabOpen = useUiStore((s) => s.isFabOpen);
  const toggleFab = useUiStore((s) => s.toggleFab);
  const showFabLabels = useSettingsStore((s) => s.showFabLabels);
  const [importVisible, setImportVisible] = useState(false);

  const actions: FabAction[] = useMemo(
    () => [
      {
        id: 'import',
        icon: '📷',
        label: '导入照片',
        onPress: () => {
          toggleFab(false);
          setImportVisible(true);
        },
      },
      {
        id: 'ai',
        icon: '🤖',
        label: 'AI 分析',
        onPress: () => {
          toggleFab(false);
          useUiStore.getState().setAiOverlayVisible(true);
        },
      },
      {
        id: 'collage',
        icon: '🖼️',
        label: '拼图',
        onPress: () => {
          toggleFab(false);
          const ids = usePhotoStore.getState().photos.filter((p) => !p.isDeleted).slice(0, 9).map((p) => p.id);
          if (ids.length >= 2) {
            navigation.navigate('Collage', { photoIds: ids });
          }
        },
      },
      {
        id: 'slideshow',
        icon: '▶️',
        label: '幻灯片',
        onPress: () => {
          toggleFab(false);
          const ids = usePhotoStore.getState().photos.filter((p) => !p.isDeleted).map((p) => p.id);
          if (ids.length > 0) {
            navigation.navigate('Slideshow', { photoIds: ids });
          }
        },
      },
      {
        id: 'dedup',
        icon: '🔍',
        label: '去重扫描',
        onPress: () => {
          toggleFab(false);
          useUiStore.getState().setDedupOverlayVisible(true);
        },
      },
      {
        id: 'storage',
        icon: '📦',
        label: '存储管理',
        onPress: () => {
          toggleFab(false);
          navigation.navigate('StorageDashboard');
        },
      },
    ],
    [navigation, toggleFab],
  );

  return (
    <View style={styles.container}>
      {/* 展开菜单 */}
      {isFabOpen && (
        <View style={styles.menu}>
          {actions.map((action) => (
            <FabButton
              key={action.id}
              icon={action.icon}
              label={action.label}
              onPress={action.onPress}
              showLabel={showFabLabels}
            />
          ))}
        </View>
      )}

      {/* 主 FAB */}
      <Pressable
        style={[styles.fab, { backgroundColor: theme.colors.primaryContainer }]}
        onPress={() => toggleFab()}
      >
        <Text style={[styles.fabIcon, { color: theme.colors.onPrimaryContainer }]}>
          {isFabOpen ? '✕' : '+'}
        </Text>
      </Pressable>

      <ImportProgressModal
        visible={importVisible}
        files={[
          { name: 'IMG_20260515_143022.jpg', sizeBytes: 3.2 * 1024 * 1024 },
          { name: 'IMG_20260515_143145.jpg', sizeBytes: 2.8 * 1024 * 1024 },
          { name: 'IMG_20260516_091200.jpg', sizeBytes: 4.1 * 1024 * 1024 },
        ]}
        onComplete={() => setImportVisible(false)}
        onCancel={() => setImportVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    alignItems: 'flex-end',
    zIndex: 100,
  },
  menu: { marginBottom: 12 },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  fabIcon: { fontSize: 24, fontWeight: '400' },
});
