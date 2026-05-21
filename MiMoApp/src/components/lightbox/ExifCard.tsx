import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useMd3Theme } from '../../theme';
import type { ExifData } from '../../types';
import { formatExifValue } from '../../utils/exif';

interface ExifCardProps {
  exif: ExifData;
}

const FIELDS: Array<{ key: keyof ExifData; label: string }> = [
  { key: 'make', label: '相机品牌' },
  { key: 'model', label: '相机型号' },
  { key: 'fNumber', label: '光圈' },
  { key: 'exposureTime', label: '快门速度' },
  { key: 'iso', label: 'ISO' },
  { key: 'focalLength', label: '焦距' },
  { key: 'flash', label: '闪光灯' },
  { key: 'software', label: '软件' },
  { key: 'dateTaken', label: '拍摄时间' },
  { key: 'width', label: '尺寸' },
  { key: 'height', label: '高度' },
];

export function ExifCard({ exif }: ExifCardProps) {
  const theme = useMd3Theme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>EXIF 信息</Text>
      <View style={styles.grid}>
        {FIELDS.map(({ key, label }) => {
          const val = formatExifValue(exif, key);
          if (val === '—') return null;
          return (
            <View key={key} style={styles.row}>
              <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>{label}</Text>
              <Text style={[styles.value, { color: theme.colors.onSurface }]}>{val}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  title: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
  grid: { gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 13 },
  value: { fontSize: 13, fontWeight: '500' },
});
