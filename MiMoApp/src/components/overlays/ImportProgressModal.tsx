import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import { useMd3Theme } from '../../theme';

// ============================================================
// ImportProgressModal — 导入照片进度弹窗
// 模拟文件逐个导入，显示进度条和当前文件名
// 后期接入真实 image-crop-picker 回调
// ============================================================

export interface ImportFile {
  name: string;
  sizeBytes: number;
}

interface ImportProgressModalProps {
  visible: boolean;
  files: ImportFile[];
  onComplete: (imported: number) => void;
  onCancel: () => void;
}

export function ImportProgressModal({ visible, files, onComplete, onCancel }: ImportProgressModalProps) {
  const theme = useMd3Theme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible || files.length === 0) return;
    setCurrentIndex(0);
    setIsComplete(false);
    progressAnim.setValue(0);

    const totalTime = Math.min(files.length * 400, 8000); // max 8 seconds for demo
    const stepTime = totalTime / files.length;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= files.length) {
          clearInterval(timer);
          setIsComplete(true);
          onComplete(files.length);
          return files.length;
        }
        return next;
      });
    }, stepTime);

    return () => clearInterval(timer);
  }, [visible, files.length]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: files.length > 0 ? currentIndex / files.length : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [currentIndex, files.length]);

  const progress = files.length > 0 ? currentIndex / files.length : 0;
  const currentFile = files[currentIndex] || files[files.length - 1];
  const totalSize = files.reduce((s, f) => s + f.sizeBytes, 0);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
          {isComplete ? (
            <>
              <Text style={styles.doneIcon}>✅</Text>
              <Text style={[styles.doneTitle, { color: theme.colors.onSurface }]}>
                导入完成
              </Text>
              <Text style={[styles.doneSub, { color: theme.colors.onSurfaceVariant }]}>
                成功导入 {files.length} 张照片
              </Text>
              <Pressable
                style={[styles.doneBtn, { backgroundColor: theme.colors.primary }]}
                onPress={onCancel}
              >
                <Text style={[styles.doneBtnText, { color: theme.colors.onPrimary }]}>完成</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.icon}>📥</Text>
              <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                正在导入照片
              </Text>
              <Text style={[styles.fileName, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
                {currentFile?.name || '...'}
              </Text>
              <Text style={[styles.counter, { color: theme.colors.onSurfaceVariant }]}>
                {currentIndex + 1} / {files.length}
              </Text>

              <View style={[styles.progressBar, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: theme.colors.primary,
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>

              <Text style={[styles.sizeText, { color: theme.colors.onSurfaceVariant }]}>
                {formatImportSize(totalSize)}
              </Text>

              <Pressable
                style={[styles.cancelBtn, { backgroundColor: theme.colors.surfaceVariant }]}
                onPress={onCancel}
              >
                <Text style={[styles.cancelText, { color: theme.colors.error }]}>取消</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

function formatImportSize(bytes: number): string {
  if (bytes > 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    maxWidth: 340,
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
  },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  fileName: { fontSize: 12, marginBottom: 8, maxWidth: '100%' },
  counter: { fontSize: 13, fontWeight: '500', marginBottom: 16 },
  progressBar: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: { height: '100%', borderRadius: 3 },
  sizeText: { fontSize: 11, marginBottom: 20 },
  cancelBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  cancelText: { fontSize: 14, fontWeight: '600' },
  doneIcon: { fontSize: 48, marginBottom: 12 },
  doneTitle: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  doneSub: { fontSize: 13, marginBottom: 20 },
  doneBtn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 20,
  },
  doneBtnText: { fontSize: 15, fontWeight: '600' },
});
