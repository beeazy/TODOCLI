import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Theme } from '../types';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  theme: Theme;
  onUpgrade: () => void;
  isPremium: boolean;
  isUpgrading: boolean;
}

export default function PremiumModal({
  visible,
  onClose,
  theme,
  onUpgrade,
  isPremium,
  isUpgrading,
}: PremiumModalProps) {
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
              PRO FEATURES
            </Text>
          </View>

          <View style={styles.content}>
            <Text style={[styles.message, { color: theme.foreground }]}>
              Pro subscriptions coming soon! Here's what you'll get:
            </Text>

            <View style={styles.featureList}>
              <Text style={[styles.feature, { color: theme.foreground }]}>
                • Task Due Dates & Reminders
              </Text>
              <Text style={[styles.feature, { color: theme.foreground }]}>
                • Recurring Tasks
              </Text>
              <Text style={[styles.feature, { color: theme.foreground }]}>
                • Advanced Task Analytics
              </Text>
              <Text style={[styles.feature, { color: theme.foreground }]}>
                • Task Notes & Attachments
              </Text>
              <Text style={[styles.feature, { color: theme.foreground }]}>
                • Subtasks & Dependencies
              </Text>
              <Text style={[styles.feature, { color: theme.foreground }]}>
                • Custom Task Labels
              </Text>
              <Text style={[styles.feature, { color: theme.foreground }]}>
                • Task Export & Cloud Backup
              </Text>
              <Text style={[styles.feature, { color: theme.foreground }]}>
                • More themes and colors
              </Text>
            </View>

            <View style={styles.pricing}>
              <Text style={[styles.priceTag, { color: theme.accent }]}>
                {/* ;) */}
                $1.99/month (or less)
              </Text>
              <Text style={[styles.priceNote, { color: theme.muted }]}>
                Available soon
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, { borderColor: theme.muted }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: theme.muted }]}>
                close
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
  content: {
    padding: 20,
  },
  message: {
    fontFamily: "monospace",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  featureList: {
    marginBottom: 24,
  },
  feature: {
    fontFamily: "monospace",
    fontSize: 14,
    lineHeight: 24,
  },
  pricing: {
    alignItems: "center",
  },
  priceTag: {
    fontFamily: "monospace",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  priceNote: {
    fontFamily: "monospace",
    fontSize: 12,
  },
  footer: {
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