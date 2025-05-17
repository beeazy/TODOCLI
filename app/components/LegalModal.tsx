import React from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Theme } from '../types';

interface LegalModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: string;
  theme: Theme;
}

const LegalModal = ({ visible, onClose, title, content, theme }: LegalModalProps) => {
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
            shadowColor: theme.accent,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5
          }
        ]}>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.accent }]}>
              {title}
            </Text>
          </View>
          
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.text, { color: theme.foreground }]}>
              {content}
            </Text>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <TouchableOpacity
              style={[styles.button, { 
                backgroundColor: theme.accent,
                borderColor: theme.accent,
              }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: theme.background }]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: Math.min(width - 32, 600),
    maxHeight: "80%",
    borderRadius: 8,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: "monospace",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 1,
  },
  content: {
    padding: 16,
    maxHeight: 400,
  },
  text: {
    fontFamily: "monospace",
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    alignItems: "center",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 4,
  },
  buttonText: {
    fontFamily: "monospace",
    fontSize: 14,
    letterSpacing: 0.5,
  },
});

export default LegalModal; 