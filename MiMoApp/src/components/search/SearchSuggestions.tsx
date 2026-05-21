import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useMd3Theme } from '../../theme';
import { useSettingsStore, usePhotoStore } from '../../store';

interface SearchSuggestionsProps {
  onSelect: (query: string) => void;
}

const SUGGESTIONS = [
  '海边的日落',
  '去年的旅行',
  '猫和狗',
  '春天的花',
  '生日聚会',
  '夜景',
  '美食',
  '自拍',
];

export function SearchSuggestions({ onSelect }: SearchSuggestionsProps) {
  const theme = useMd3Theme();
  const searchHistory = useSettingsStore((s) => s.searchHistory);
  const setFilter = usePhotoStore((s) => s.setFilter);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* 搜索历史 */}
      {searchHistory.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>
            最近搜索
          </Text>
          {searchHistory.slice(0, 5).map((query) => (
            <Pressable
              key={query}
              style={[styles.item, { borderBottomColor: theme.colors.outlineVariant }]}
              onPress={() => {
                setFilter({ searchQuery: query });
                onSelect(query);
              }}
            >
              <Text style={styles.itemIcon}>🕐</Text>
              <Text style={[styles.itemText, { color: theme.colors.onSurface }]}>{query}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* 推荐搜索 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>
          试试搜索
        </Text>
        <View style={styles.chipRow}>
          {SUGGESTIONS.map((s) => (
            <Pressable
              key={s}
              style={[styles.chip, { backgroundColor: theme.colors.surfaceVariant }]}
              onPress={() => {
                setFilter({ searchQuery: s });
                onSelect(s);
              }}
            >
              <Text style={[styles.chipText, { color: theme.colors.onSurface }]}>{s}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 8 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '600', paddingHorizontal: 16, marginBottom: 8 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  itemIcon: { fontSize: 14, marginRight: 10 },
  itemText: { fontSize: 15 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  chipText: { fontSize: 13 },
});
