import { useCallback } from 'react';

// ============================================================
// useHaptics — 触感反馈接口预留
// 后期接入 react-native-haptic-feedback 或
// expo-haptics 提供真实触感
// 当前所有操作均为 no-op，不影响功能
// ============================================================

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

interface HapticsAPI {
  /** 触发一次触感 */
  trigger: (type?: HapticType) => void;
  /** 成功反馈 */
  success: () => void;
  /** 错误反馈 */
  error: () => void;
  /** 选择反馈 */
  selection: () => void;
  /** 轻触反馈（按钮按下） */
  light: () => void;
  /** 中等反馈（手势确认） */
  medium: () => void;
  /** 重反馈（重要操作） */
  heavy: () => void;
}

export function useHaptics(): HapticsAPI {
  const trigger = useCallback((_type: HapticType = 'light') => {
    // 后期接入:
    // import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
    // ReactNativeHapticFeedback.trigger('impactLight');
  }, []);

  const success = useCallback(() => {
    // ReactNativeHapticFeedback.trigger('notificationSuccess');
  }, []);

  const error = useCallback(() => {
    // ReactNativeHapticFeedback.trigger('notificationError');
  }, []);

  const selection = useCallback(() => {
    // ReactNativeHapticFeedback.trigger('selection');
  }, []);

  const light = useCallback(() => trigger('light'), [trigger]);
  const medium = useCallback(() => trigger('medium'), [trigger]);
  const heavy = useCallback(() => trigger('heavy'), [trigger]);

  return { trigger, success, error, selection, light, medium, heavy };
}
