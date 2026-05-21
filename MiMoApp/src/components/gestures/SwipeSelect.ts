import { Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { usePhotoStore } from '../../store';

// ============================================================
// SwipeSelect — 滑动多选手势
// 在网格上滑动手指批量选中/取消选中照片
// ============================================================

export function useSwipeSelect() {
  const selectionMode = usePhotoStore((s) => s.selectionMode);
  const toggleSelection = usePhotoStore((s) => s.toggleSelection);

  const handleToggle = (id: string) => {
    toggleSelection(id);
  };

  // 该手势不关心坐标细节，由 PhotoCard 的 longPress 触发选择模式后启用
  const gesture = Gesture.Pan()
    .enabled(selectionMode)
    .onUpdate(() => {
      // 后期实现：根据手指位置命中测试计算命中了哪些卡片
      // 需要配合各 PhotoCard 的 layout measurement
    });

  return { gesture, toggleSelection: handleToggle };
}
