import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, type ViewStyle } from 'react-native';

// ============================================================
// NotificationBadge — 通知徽章
// 用于标签栏、FAB、设置图标等位置，
// 显示新导入数/AI完成数/存储告警等
// ============================================================

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  visible?: boolean;
  color?: string;
  size?: 'small' | 'medium';
  style?: ViewStyle;
  pulse?: boolean;
}

export function NotificationBadge({
  count,
  maxCount = 99,
  visible = true,
  color = '#B3261E',
  size = 'medium',
  style,
  pulse = false,
}: NotificationBadgeProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!pulse || count === 0) return;

    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [count, pulse]);

  if (!visible || count === 0) return null;

  const dotSize = size === 'small' ? 6 : 10;
  const fontSize = size === 'small' ? 9 : 11;
  const minWidth = size === 'small' ? 16 : 22;
  const paddingH = size === 'small' ? 4 : 6;
  const paddingV = size === 'small' ? 1 : 3;

  if (count === -1) {
    // 纯红点模式（无数字）
    return (
      <Animated.View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            backgroundColor: color,
            transform: [{ scale: pulseAnim }],
          },
          style,
        ]}
      />
    );
  }

  const displayText = count > maxCount ? `${maxCount}+` : `${count}`;

  return (
    <Animated.View
      style={[
        styles.badge,
        {
          backgroundColor: color,
          minWidth,
          paddingHorizontal: paddingH,
          paddingVertical: paddingV,
          borderRadius: minWidth / 2,
          transform: [{ scale: pulseAnim }],
        },
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize }]}>{displayText}</Text>
    </Animated.View>
  );
}

// 多个徽章并排放置
interface BadgeGroupProps {
  badges: Array<{ id: string; count: number; color?: string }>;
  style?: ViewStyle;
}

export function BadgeGroup({ badges, style }: BadgeGroupProps) {
  return (
    <View style={[styles.group, style]}>
      {badges.map((b) => (
        <NotificationBadge
          key={b.id}
          count={b.count}
          color={b.color}
          size="small"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    borderRadius: 99,
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  group: {
    flexDirection: 'row',
    gap: 4,
    position: 'absolute',
    top: -4,
    right: -4,
  },
});
