import React, { useEffect, useRef, useState } from 'react';
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
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (item.completed) {
      // Just fade to 50% opacity when completed
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Fade back to full opacity when uncompleted
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [item.completed]);

  const handleToggle = () => {
    onToggle(item.id);
  };

  const handleEdit = () => {
    onEdit(item);
  };

  const handleDelete = () => {
    onDelete(item.id);
  };

  const handlePriorityChange = (newPriority: Task['priority']) => {
    // if (!isPremium) {
    //   analytics.trackInteraction('premium_required', 'priority_change', { taskId: item.id });
    //   onPremiumPrompt();
    //   return;
    // }
    onPriorityChange(item.id, newPriority);
  };

  const handlePriorityClick = () => {
    setIsPriorityModalVisible(true);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          // transform: [{ scale: scaleAnim }],
          backgroundColor: 'transparent',
        },
      ]}
    >
      <AnimatedTouchable style={styles.taskItem} onPress={handleToggle}>
        <Text
          style={[
            styles.taskText,
            { color: theme.accent },
            item.completed && [styles.taskTextCompleted, { color: theme.muted }]
          ]}
        >
          {item.text}
        </Text>
      </AnimatedTouchable>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton]}
          onPress={handlePriorityClick}
        >
          <Text style={[styles.actionButtonText, { 
            color: item.priority ? PRIORITIES[item.priority].color : theme.muted 
          }]}>
            {item.priority ? PRIORITIES[item.priority].label.toLowerCase() : 'p?'}
          </Text>
        </TouchableOpacity>
        {/* <Text style={[styles.separator, { color: theme.muted }]}>|</Text> */}
        {/* <TouchableOpacity
          style={[styles.actionButton]}
          onPress={handleEdit}
        >
          <Text style={[styles.actionButtonText, { color: theme.accent }]}>
            edit
          </Text>
        </TouchableOpacity> */}
        {/* <Text style={[styles.separator, { color: theme.muted }]}>|</Text> */}
        {/* <TouchableOpacity
          style={[styles.actionButton]}
          onPress={handleDelete}
        >
          <Text style={[styles.actionButtonText, { color: theme.error }]}>
            rm
          </Text>
        </TouchableOpacity> */}
      </View>

      <PriorityModal
        visible={isPriorityModalVisible}
        onClose={() => setIsPriorityModalVisible(false)}
        onSelectPriority={(priority) => {
          handlePriorityChange(priority);
          setIsPriorityModalVisible(false);
        }}
        currentPriority={item.priority}
        theme={theme}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  taskItem: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  taskText: {
    fontFamily: "monospace",
    fontSize: 14,
    lineHeight: 20,
    // uppercase
    textTransform: "uppercase",
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 12,
  },
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  actionButtonText: {
    fontFamily: "monospace",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  separator: {
    fontFamily: 'monospace',
    fontSize: 13,
  }
}); 