import React, { useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Theme } from '../types';
import PriorityModal from './PriorityModal';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  tabId: string;
  priority?: 'P0' | 'P1' | 'P2' | 'P3';
}

interface TaskItemProps {
  item: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onPriorityChange: (id: string, priority: Task['priority']) => void;
  onPremiumPrompt: () => void;
  theme: Theme;
  isPremium: boolean;
}

const PRIORITIES: Record<string, { label: string; color: string }> = {
  P0: { label: 'P0', color: '#FF453A' },
  P1: { label: 'P1', color: '#FF9F0A' },
  P2: { label: 'P2', color: '#32D74B' },
  P3: { label: 'P3', color: '#64D2FF' },
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function TaskItem({
  item,
  onToggle,
  onEdit,
  onDelete,
  onPriorityChange,
  onPremiumPrompt,
  theme,
  isPremium,
}: TaskItemProps) {
  const [isPriorityModalVisible, setIsPriorityModalVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => onToggle(item.id));
  };

  const handlePriorityClick = () => {
    setIsPriorityModalVisible(true);
  };

  const renderPriorityButton = () => {
    const currentPriority = item.priority;
    const priorityColor = currentPriority ? PRIORITIES[currentPriority].color : theme.muted;

    return (
      <>
        <TouchableOpacity
          style={[styles.priorityButton, { borderColor: priorityColor }]}
          onPress={handlePriorityClick}
        >
          <Text style={[styles.priorityButtonText, { color: priorityColor }]}>
            {currentPriority || 'P?'}
          </Text>
        </TouchableOpacity>

        <PriorityModal
          visible={isPriorityModalVisible}
          onClose={() => setIsPriorityModalVisible(false)}
          onSelectPriority={(priority) => {
            onPriorityChange(item.id, priority);
            setIsPriorityModalVisible(false);
          }}
          currentPriority={item.priority}
          theme={theme}
        />
      </>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
          borderColor: theme.border,
          backgroundColor: theme.surface,
        },
      ]}
    >
      <AnimatedTouchable style={styles.taskItem} onPress={handlePress}>
        <Text
          style={[
            styles.taskText,
            { color: theme.foreground },
            item.completed && [styles.taskTextCompleted, { color: theme.muted }]
          ]}
        >
          {item.completed ? "[✓] " : "[ ] "}
          {item.text}
        </Text>
      </AnimatedTouchable>
      <View style={styles.actions}>
        {renderPriorityButton()}
        <TouchableOpacity
          style={[styles.actionButton, { 
            backgroundColor: 'transparent',
            borderColor: theme.accent 
          }]}
          onPress={() => onEdit(item)}
        >
          <Text style={[styles.actionButtonText, { color: theme.accent }]}>
            Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { 
            backgroundColor: 'transparent',
            borderColor: theme.error
          }]}
          onPress={() => onDelete(item.id)}
        >
          <Text style={[styles.actionButtonText, { color: theme.error }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
  },
  taskItem: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  taskText: {
    fontFamily: "monospace",
    fontSize: 15,
    lineHeight: 22,
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 12,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    minWidth: 70,
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: "monospace",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  priorityButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  priorityButtonText: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '600',
  },
}); 