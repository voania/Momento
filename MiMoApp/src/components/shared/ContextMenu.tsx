import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TouchableWithoutFeedback } from 'react-native';
import { useMd3Theme } from '../../theme';

// ============================================================
// ContextMenu — 长按弹出菜单
// 后期接入 react-native-context-menu-view（iOS/Android 原生菜单）
// ============================================================

export interface ContextMenuAction {
  id: string;
  label: string;
  icon?: string;
  destructive?: boolean;
  onPress: () => void;
}

interface ContextMenuProps {
  visible: boolean;
  actions: ContextMenuAction[];
  onClose: () => void;
  title?: string;
}

export function ContextMenu({ visible, actions, onClose, title }: ContextMenuProps) {
  const theme = useMd3Theme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={[styles.menu, { backgroundColor: theme.colors.surface }]}>
              {title && (
                <Text style={[styles.title, { color: theme.colors.onSurfaceVariant }]}>{title}</Text>
              )}
              {actions.map((action, idx) => (
                <Pressable
                  key={action.id}
                  style={[
                    styles.item,
                    idx < actions.length - 1 && {
                      borderBottomWidth: 0.5,
                      borderBottomColor: theme.colors.outlineVariant,
                    },
                  ]}
                  onPress={() => {
                    onClose();
                    action.onPress();
                  }}
                >
                  {action.icon && <Text style={styles.icon}>{action.icon}</Text>}
                  <Text
                    style={[
                      styles.label,
                      {
                        color: action.destructive
                          ? theme.colors.error
                          : theme.colors.onSurface,
                      },
                    ]}
                  >
                    {action.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000066',
    padding: 40,
  },
  menu: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  icon: { fontSize: 18, marginRight: 12 },
  label: { fontSize: 16, fontWeight: '500' },
});
