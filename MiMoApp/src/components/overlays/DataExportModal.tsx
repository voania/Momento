import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useMd3Theme } from '../../theme';
import { usePhotoStore, useAlbumStore, useUiStore } from '../../store';

// ============================================================
// DataExportModal — 数据导出/备份
// 导出范围：全部照片元数据、相册结构、设置
// 输出 JSON 字符串，后期可存入文件
// ============================================================

interface DataExportModalProps {
  visible: boolean;
  onClose: () => void;
}

type ExportScope = 'metadata' | 'albums' | 'settings' | 'full';

export function DataExportModal({ visible, onClose }: DataExportModalProps) {
  const theme = useMd3Theme();
  const photos = usePhotoStore((s) => s.photos);
  const albums = useAlbumStore((s) => s.albums);
  const showToast = useUiStore((s) => s.showToast);

  const [scope, setScope] = useState<ExportScope>('full');
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<string | null>(null);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setExportResult(null);

    // 模拟异步导出
    await new Promise<void>((resolve) => setTimeout(resolve, 600));

    const data: Record<string, any> = {};

    if (scope === 'metadata' || scope === 'full') {
      data.metadata = photos.map((p) => ({
        id: p.id,
        filename: p.filename,
        dateTaken: p.dateTaken,
        sizeBytes: p.sizeBytes,
        width: p.width,
        height: p.height,
        locationName: p.locationName,
        latitude: p.latitude,
        longitude: p.longitude,
        aiTags: p.aiTags,
        aiCategory: p.aiCategory,
        rating: p.rating,
        isFavorite: p.isFavorite,
        exif: p.exif,
      }));
      data.totalPhotos = data.metadata.length;
    }

    if (scope === 'albums' || scope === 'full') {
      data.albums = albums.map((a) => ({
        id: a.id,
        name: a.name,
        description: a.description,
        photoCount: a.photoCount,
        isSmart: a.isSmart,
        smartRules: a.smartRules,
        createdAt: a.createdAt,
      }));
    }

    if (scope === 'settings' || scope === 'full') {
      data.settings = {
        exportedAt: new Date().toISOString(),
        version: '1.0',
      };
    }

    setExportResult(JSON.stringify(data, null, 2));
    setIsExporting(false);
  }, [scope, photos, albums]);

  const handleCopy = () => {
    if (exportResult) {
      showToast('已复制到剪贴板（接口预留）', 'success');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.handle, { backgroundColor: theme.colors.outlineVariant }]} />

          <Text style={[styles.title, { color: theme.colors.onSurface }]}>数据导出</Text>

          {!exportResult ? (
            <>
              {/* 范围选择 */}
              <Text style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
                导出范围
              </Text>
              <View style={styles.scopeRow}>
                {([
                  { key: 'metadata' as ExportScope, label: '照片元数据', icon: '📋' },
                  { key: 'albums' as ExportScope, label: '相册结构', icon: '📁' },
                  { key: 'settings' as ExportScope, label: '设置', icon: '⚙️' },
                  { key: 'full' as ExportScope, label: '全部数据', icon: '📦' },
                ]).map((opt) => (
                  <Pressable
                    key={opt.key}
                    style={[
                      styles.scopeChip,
                      {
                        backgroundColor:
                          scope === opt.key
                            ? theme.colors.primaryContainer
                            : theme.colors.surfaceVariant,
                      },
                    ]}
                    onPress={() => setScope(opt.key)}
                  >
                    <Text style={{ fontSize: 16 }}>{opt.icon}</Text>
                    <Text
                      style={[
                        styles.scopeLabel,
                        {
                          color:
                            scope === opt.key
                              ? theme.colors.onPrimaryContainer
                              : theme.colors.onSurfaceVariant,
                        },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* 统计预览 */}
              <View style={[styles.preview, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Text style={[styles.previewItem, { color: theme.colors.onSurfaceVariant }]}>
                  照片: {photos.length} 张
                </Text>
                <Text style={[styles.previewItem, { color: theme.colors.onSurfaceVariant }]}>
                  相册: {albums.length} 个
                </Text>
                <Text style={[styles.previewItem, { color: theme.colors.onSurfaceVariant }]}>
                  格式: JSON (UTF-8)
                </Text>
              </View>

              {/* 操作按钮 */}
              <View style={styles.actions}>
                <Pressable
                  style={[styles.btn, { backgroundColor: theme.colors.surfaceVariant }]}
                  onPress={onClose}
                >
                  <Text style={[styles.btnText, { color: theme.colors.onSurface }]}>取消</Text>
                </Pressable>
                <Pressable
                  style={[styles.btn, { backgroundColor: theme.colors.primary }]}
                  onPress={handleExport}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <ActivityIndicator size="small" color={theme.colors.onPrimary} />
                  ) : (
                    <Text style={[styles.btnText, { color: theme.colors.onPrimary }]}>
                      导出
                    </Text>
                  )}
                </Pressable>
              </View>
            </>
          ) : (
            <>
              {/* 导出结果预览 */}
              <Text style={[styles.resultInfo, { color: theme.colors.onSurfaceVariant }]}>
                {`生成 ${exportResult.length} 字符 JSON 数据`}
              </Text>
              <View style={[styles.resultBox, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Text
                  style={[styles.resultText, { color: theme.colors.onSurface }]}
                  numberOfLines={20}
                >
                  {exportResult.slice(0, 2000)}
                  {exportResult.length > 2000 ? '\n...' : ''}
                </Text>
              </View>
              <View style={styles.actions}>
                <Pressable
                  style={[styles.btn, { backgroundColor: theme.colors.surfaceVariant }]}
                  onPress={() => setExportResult(null)}
                >
                  <Text style={[styles.btnText, { color: theme.colors.onSurface }]}>返回</Text>
                </Pressable>
                <Pressable
                  style={[styles.btn, { backgroundColor: theme.colors.primary }]}
                  onPress={handleCopy}
                >
                  <Text style={[styles.btnText, { color: theme.colors.onPrimary }]}>复制</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000066',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    maxHeight: '80%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  sectionLabel: { fontSize: 12, fontWeight: '600', marginBottom: 10 },
  scopeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  scopeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  scopeLabel: { fontSize: 13, fontWeight: '500' },
  preview: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    gap: 4,
  },
  previewItem: { fontSize: 13 },
  actions: { flexDirection: 'row', gap: 12 },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  btnText: { fontSize: 15, fontWeight: '600' },
  resultInfo: { fontSize: 13, marginBottom: 10 },
  resultBox: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    maxHeight: 320,
  },
  resultText: { fontSize: 11, fontFamily: 'monospace', lineHeight: 16 },
});
