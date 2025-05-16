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
              $ {title.toLowerCase()}
            </Text>
          </View>

          <View style={styles.messageContainer}>
            <Text style={[styles.message, { color: theme.muted }]}>
              {'>>'} {message}
            </Text>
          </View>

          <View style={styles.actions}>
            {actions.map((action, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <Text style={[styles.separator, { color: theme.muted }]}>|</Text>
                )}
                <TouchableOpacity
                  style={styles.button}
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
                    {action.text.toLowerCase()}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
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
  messageContainer: {
    padding: 12,
  },
  message: {
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  buttonText: {
    fontFamily: "monospace",
    fontSize: 13,
  },
  separator: {
    fontFamily: "monospace",
    fontSize: 13,
  },
}); 