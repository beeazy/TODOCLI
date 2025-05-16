import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Theme } from '../types';

interface AlertAction {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress: () => void;
}

interface ThemedAlertProps {
  visible: boolean;
  title: string;
  message: string;
  actions: AlertAction[];
  theme: Theme;
  onDismiss: () => void;
}

export default function ThemedAlert({
  visible,
  title,
  message,
  actions,
  theme,
  onDismiss,
}: ThemedAlertProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onDismiss}
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
              {title}
            </Text>
          </View>

          <View style={styles.messageContainer}>
            <Text style={[styles.message, { color: theme.foreground }]}>
              {message}
            </Text>
          </View>

          <View style={styles.actions}>
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  {
                    borderColor: action.style === 'destructive'
                      ? theme.error
                      : action.style === 'cancel'
                      ? theme.muted
                      : theme.accent,
                  }
                ]}
                onPress={() => {
                  action.onPress();
                  onDismiss();
                }}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: action.style === 'destructive'
                        ? theme.error
                        : action.style === 'cancel'
                        ? theme.muted
                        : theme.accent,
                    }
                  ]}
                >
                  {action.text}
                </Text>
              </TouchableOpacity>
            ))}
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
  messageContainer: {
    padding: 20,
  },
  message: {
    fontFamily: "monospace",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    padding: 20,
    paddingTop: 0,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    borderWidth: 1,
    minWidth: 100,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "monospace",
    fontSize: 14,
    letterSpacing: 0.5,
  },
}); 