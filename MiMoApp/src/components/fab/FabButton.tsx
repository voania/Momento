import React from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import { useMd3Theme } from '../../theme';

interface FabButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  showLabel?: boolean;
}

export function FabButton({ icon, label, onPress, showLabel }: FabButtonProps) {
  const theme = useMd3Theme();

  return (
    <Pressable
      style={[styles.btn, { backgroundColor: theme.colors.primaryContainer }]}
      onPress={onPress}
    >
      <Text style={styles.icon}>{icon}</Text>
      {showLabel && (
        <Text style={[styles.label, { color: theme.colors.onPrimaryContainer }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  icon: { fontSize: 20, marginRight: 8 },
  label: { fontSize: 14, fontWeight: '600' },
});
