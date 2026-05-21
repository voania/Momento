import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

// ============================================================
// ErrorBoundary — React 错误边界
// 捕获渲染错误，显示友好恢复界面
// 包裹在每个屏幕外层以防止整页崩溃
// ============================================================

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  onRetry?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error.message, info.componentStack?.slice(0, 200));
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.icon}>⚠️</Text>
          <Text style={styles.title}>
            {this.props.fallbackTitle || '出了点问题'}
          </Text>
          <Text style={styles.subtitle}>
            {this.props.fallbackSubtitle || '请重试或重启应用'}
          </Text>
          {this.state.error && (
            <Text style={styles.errorText} numberOfLines={3}>
              {this.state.error.message}
            </Text>
          )}
          <Pressable style={styles.retryBtn} onPress={this.handleRetry}>
            <Text style={styles.retryText}>重试</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFFBFE',
  },
  icon: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '600', color: '#1C1B1F', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#49454F', marginBottom: 12 },
  errorText: {
    fontSize: 11,
    color: '#B3261E',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  retryBtn: {
    backgroundColor: '#6750A4',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
