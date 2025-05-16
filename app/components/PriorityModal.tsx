import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Theme } from '../types';

interface PriorityOption {
  value: 'P0' | 'P1' | 'P2' | 'P3';
  label: string;
  color: string;
  description: string;
}

const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 'P0', label: 'P0', color: '#FF453A', description: 'Critical - Urgent tasks that need immediate attention' },
  { value: 'P1', label: 'P1', color: '#FF9F0A', description: 'High - Important tasks to be done soon' },
  { value: 'P2', label: 'P2', color: '#32D74B', description: 'Medium - Tasks to be done this week' },
  { value: 'P3', label: 'P3', color: '#64D2FF', description: 'Low - Nice to have tasks' },
];

interface PriorityModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPriority: (priority: PriorityOption['value']) => void;
  currentPriority?: PriorityOption['value'];
  theme: Theme;
}

export default function PriorityModal({
  visible,
  onClose,
  onSelectPriority,
  currentPriority,
  theme,
}: PriorityModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: "rgba(0, 0, 0, 0.95)" }]}>
        <View style={[
          styles.modalContent,
          {
            backgroundColor: theme.surface,
            borderColor: theme.accent,
          }
        ]}>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.accent }]}>
              SELECT PRIORITY
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            {PRIORITY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  {
                    borderColor: option.color,
                    backgroundColor: currentPriority === option.value ? option.color : 'transparent',
                  }
                ]}
                onPress={() => {
                  onSelectPriority(option.value);
                  onClose();
                }}
              >
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionLabel,
                    {
                      color: currentPriority === option.value ? theme.surface : option.color,
                      fontWeight: currentPriority === option.value ? '600' : 'normal',
                    }
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={[
                    styles.optionDescription,
                    {
                      color: currentPriority === option.value ? theme.surface : theme.muted,
                    }
                  ]}>
                    {option.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: theme.muted }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { color: theme.muted }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 500,
    borderRadius: 8,
    borderWidth: 1,
  },
  header: {
    borderBottomWidth: 1,
    padding: 20,
  },
  title: {
    fontFamily: "monospace",
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 2,
  },
  optionsContainer: {
    padding: 20,
    gap: 12,
  },
  optionButton: {
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
  },
  optionContent: {
    padding: 16,
  },
  optionLabel: {
    fontFamily: "monospace",
    fontSize: 16,
    marginBottom: 4,
    letterSpacing: 1,
  },
  optionDescription: {
    fontFamily: "monospace",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  footer: {
    padding: 20,
    paddingTop: 0,
    alignItems: 'center',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    borderWidth: 1,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButtonText: {
    fontFamily: "monospace",
    fontSize: 14,
    letterSpacing: 0.5,
  },
}); 