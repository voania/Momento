import React from 'react';
import { View, TextInput, StyleSheet, Pressable, Text } from 'react-native';
import { useMd3Theme } from '../../theme';
import { usePhotoStore } from '../../store';

interface SearchBarProps {
  isActive: boolean;
  onFocus: () => void;
  onClose: () => void;
  onSubmit?: (query: string) => void;
}

export function SearchBar({ isActive, onFocus, onClose, onSubmit }: SearchBarProps) {
  const theme = useMd3Theme();
  const searchQuery = usePhotoStore((s) => s.filter.searchQuery);
  const setFilter = usePhotoStore((s) => s.setFilter);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surfaceVariant,
            color: theme.colors.onSurface,
          },
        ]}
        placeholder="搜索照片..."
        placeholderTextColor={theme.colors.onSurfaceVariant}
        value={searchQuery}
        onFocus={onFocus}
        onChangeText={(text) => setFilter({ searchQuery: text })}
        returnKeyType="search"
        onSubmitEditing={() => {
          if (searchQuery.trim() && onSubmit) {
            onSubmit(searchQuery.trim());
          }
        }}
      />
      {isActive && (
        <Pressable onPress={onClose} style={styles.cancelBtn}>
          <Text style={[styles.cancelText, { color: theme.colors.primary }]}>取消</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  cancelBtn: { marginLeft: 12 },
  cancelText: { fontSize: 15, fontWeight: '500' },
});
