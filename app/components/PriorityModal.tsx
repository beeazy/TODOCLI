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
  { value: 'P0', label: 'p0', color: '#FF453A', description: 'critical - urgent tasks that need immediate attention' },
  { value: 'P1', label: 'p1', color: '#FF9F0A', description: 'high - important tasks to be done soon' },
  { value: 'P2', label: 'p2', color: '#32D74B', description: 'medium - tasks to be done this week' },
  { value: 'P3', label: 'p3', color: '#64D2FF', description: 'low - nice to have tasks' },
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
            <Text style={[styles.title, { color: theme.foreground }]}>
              $ priority --set
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            {PRIORITY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  {
                    borderLeftColor: option.color,
                    borderLeftWidth: currentPriority === option.value ? 2 : 0,
                    backgroundColor: currentPriority === option.value ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
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
                      color: currentPriority === option.value ? theme.foreground : option.color,
                      marginLeft: currentPriority === option.value ? 10 : 12,
                    }
                  ]}>
                    {currentPriority === option.value ? '>' : ' '} {option.label}
                  </Text>
                  <Text style={[
                    styles.optionDescription,
                    {
                      color: currentPriority === option.value ? theme.foreground : theme.muted,
                      opacity: currentPriority === option.value ? 0.9 : 0.7,
                      marginLeft: currentPriority === option.value ? 22 : 24,
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
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { color: theme.foreground, opacity: 0.7 }]}>
                $ exit
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
    padding: 16,
  },
  modalContent: {
    width: "100%",
    maxWidth: 500,
    borderWidth: 1,
  },
  header: {
    borderBottomWidth: 1,
    padding: 12,
  },
  title: {
    fontFamily: "monospace",
    fontSize: 14,
    textAlign: "left",
    letterSpacing: 1,
  },
  optionsContainer: {
    padding: 12,
    gap: 4,
  },
  optionButton: {
    overflow: 'hidden',
  },
  optionContent: {
    paddingVertical: 8,
  },
  optionLabel: {
    fontFamily: "monospace",
    fontSize: 13,
    marginBottom: 2,
  },
  optionDescription: {
    fontFamily: "monospace",
    fontSize: 13,
  },
  footer: {
    padding: 12,
    alignItems: 'flex-start',
    paddingLeft: 24,
  },
  cancelButton: {
    paddingVertical: 4,
  },
  cancelButtonText: {
    fontFamily: "monospace",
    fontSize: 13,
  },
}); 