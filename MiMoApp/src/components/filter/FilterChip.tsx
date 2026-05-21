import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { useMd3Theme } from '../../theme';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

export function FilterChip({ label, selected, onToggle }: FilterChipProps) {
  const theme = useMd3Theme();

  return (
    <Pressable
      onPress={onToggle}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
          borderColor: selected ? theme.colors.primary : 'transparent',
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: selected ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  label: { fontSize: 13, fontWeight: '600' },
});
