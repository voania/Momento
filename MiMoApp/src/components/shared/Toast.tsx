import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useUiStore } from '../../store';
import { useMd3Theme } from '../../theme';

export function Toast() {
  const theme = useMd3Theme();
  const toasts = useUiStore((s) => s.toasts);
  const dismissToast = useUiStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((t) => (
        <View
          key={t.id}
          style={[
            styles.toast,
            {
              backgroundColor: theme.colors.inverseSurface,
              shadowColor: theme.colors.shadow,
            },
          ]}
        >
          <Text style={[styles.text, { color: theme.colors.inverseOnSurface }]}>{t.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    right: 24,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 8,
    elevation: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  text: { fontSize: 14, fontWeight: '500' },
});
