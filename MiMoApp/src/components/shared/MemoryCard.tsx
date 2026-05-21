import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useMd3Theme } from '../../theme';
import { formatRelative } from '../../utils/date';
import type { MemoryPhoto } from '../../types';

// ============================================================
// MemoryCard — "那年今天" 回忆卡片
// ============================================================

interface MemoryCardProps {
  memory: MemoryPhoto;
  photoUri?: string;
  color?: string;
  onPress: (photoId: string) => void;
}

export function MemoryCard({ memory, photoUri, color, onPress }: MemoryCardProps) {
  const theme = useMd3Theme();

  return (
    <Pressable
      style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}
      onPress={() => onPress(memory.photoId)}
    >
      {/* 背景图 */}
      <View style={[styles.imageWrap, { backgroundColor: color || theme.colors.primaryContainer }]}>
        {photoUri && (
          <Image source={{ uri: photoUri }} style={styles.image} resizeMode="cover" />
        )}
        <View style={styles.overlay}>
          <Text style={styles.overlayIcon}>📷</Text>
        </View>
      </View>

      {/* 信息 */}
      <View style={styles.info}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>{memory.title}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          {memory.subtitle}
        </Text>
        <Text style={[styles.date, { color: theme.colors.outline }]}>
          {formatRelative(memory.date)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  imageWrap: { height: 160, width: '100%' },
  image: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#00000033',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayIcon: { fontSize: 40 },
  info: { padding: 14 },
  title: { fontSize: 16, fontWeight: '700' },
  subtitle: { fontSize: 13, marginTop: 2 },
  date: { fontSize: 12, marginTop: 4 },
});
