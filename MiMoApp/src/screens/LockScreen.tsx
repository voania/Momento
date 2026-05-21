import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useMd3Theme } from '../theme';
import { useSettingsStore } from '../store';
import type { RootStackScreenProps } from '../navigation/types';

// ============================================================
// LockScreen — PIN 码锁屏 + 生物识别
// 后期扩展：接入 react-native-biometrics
// ============================================================

const PIN_LENGTH = 4;

export function LockScreen({ navigation }: RootStackScreenProps<'Lock'>) {
  const theme = useMd3Theme();
  const storedPin = useSettingsStore((s) => s.pinCode);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleDigit = useCallback(
    (digit: number) => {
      const next = input + digit.toString();
      setInput(next);
      if (next.length === PIN_LENGTH) {
        if (next === storedPin) {
          setInput('');
          setError(false);
          navigation.replace('Main');
        } else {
          setInput('');
          setError(true);
          setTimeout(() => setError(false), 600);
        }
      }
    },
    [input, storedPin, navigation],
  );

  const handleDelete = useCallback(() => {
    setInput((prev) => prev.slice(0, -1));
  }, []);

  const dots = Array.from({ length: PIN_LENGTH }, (_, i) => i < input.length);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>输入PIN码</Text>

      {/* 圆点指示器 */}
      <View style={styles.dotRow}>
        {dots.map((filled, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: filled ? theme.colors.primary : theme.colors.surfaceVariant,
                borderColor: error ? theme.colors.error : theme.colors.outline,
              },
            ]}
          />
        ))}
      </View>

      {/* 数字键盘 */}
      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, -1, 0, -2].map((digit, i) => {
          if (digit === -1) return <View key={i} style={styles.key} />;
          if (digit === -2)
            return (
              <Pressable key={i} style={styles.key} onPress={handleDelete}>
                <Text style={[styles.keyText, { color: theme.colors.onSurface }]}>⌫</Text>
              </Pressable>
            );
          return (
            <Pressable key={i} style={styles.key} onPress={() => handleDigit(digit)}>
              <View style={[styles.keyCircle, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Text style={[styles.keyText, { color: theme.colors.onSurface }]}>{digit}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 80 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 40 },
  dotRow: { flexDirection: 'row', gap: 20, marginBottom: 48 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5 },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', width: 252, justifyContent: 'center' },
  key: { width: 84, height: 72, justifyContent: 'center', alignItems: 'center' },
  keyCircle: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  keyText: { fontSize: 24, fontWeight: '500' },
});
