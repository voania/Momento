import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useMd3Theme } from '../../theme';

interface ToolbarProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export function Toolbar({ title, subtitle, showBack, onBack, actions }: ToolbarProps) {
  const theme = useMd3Theme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      accessible
      accessibilityLabel={title}
      accessibilityRole="header"
    >
      <View style={styles.left}>
        {showBack && (
          <Pressable
            onPress={onBack}
            style={styles.backBtn}
            accessible
            accessibilityLabel="返回"
            accessibilityHint="返回上一页"
            accessibilityRole="button"
          >
            <Text style={[styles.backText, { color: theme.colors.primary }]}>←</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.center}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      <View style={styles.right}>{actions}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    elevation: 1,
  },
  left: { width: 48, alignItems: 'flex-start' },
  center: { flex: 1, alignItems: 'center' },
  right: { width: 48, alignItems: 'flex-end' },
  backBtn: { padding: 4 },
  backText: { fontSize: 22, fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '600' },
  subtitle: { fontSize: 12, marginTop: 1 },
});
