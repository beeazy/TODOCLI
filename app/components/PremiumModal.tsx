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
              $ todo pro
            </Text>
          </View>

          <View style={styles.content}>
            <Text style={[styles.message, { color: theme.foreground }]}>
              $ echo "coming soon..."
            </Text>

            <View style={styles.featureList}>
              <Text style={[styles.feature, { color: theme.foreground }]}>
                $ features --list
              </Text>
              <Text style={[styles.feature, { color: theme.muted }]}>
                {'>>'} due dates, reminders
              </Text>
              <Text style={[styles.feature, { color: theme.muted }]}>
                {'>>'} recurring tasks
              </Text>
              <Text style={[styles.feature, { color: theme.muted }]}>
                {'>>'} analytics dashboard
              </Text>
              <Text style={[styles.feature, { color: theme.muted }]}>
                {'>>'} notes, attachments
              </Text>
              <Text style={[styles.feature, { color: theme.muted }]}>
                {'>>'} subtasks, dependencies
              </Text>
              <Text style={[styles.feature, { color: theme.muted }]}>
                {'>>'} custom labels
              </Text>
              <Text style={[styles.feature, { color: theme.muted }]}>
                {'>>'} cloud backup
              </Text>
              <Text style={[styles.feature, { color: theme.muted }]}>
                {'>>'} theme customization
              </Text>
            </View>

            <View style={styles.pricing}>
              <Text style={[styles.feature, { color: theme.foreground }]}>
                $ price --info
              </Text>
              <Text style={[styles.priceTag, { color: theme.accent }]}>
                {'>>'} $1.99/month (or less)
              </Text>
              <Text style={[styles.priceNote, { color: theme.muted }]}>
                {'>>'} launching soon...
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, { borderColor: theme.muted }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: theme.muted }]}>
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
    fontSize: 16,
    textAlign: "center",
    letterSpacing: 1,
  },
  content: {
    padding: 16,
  },
  message: {
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  featureList: {
    marginBottom: 20,
  },
  feature: {
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 20,
  },
  pricing: {
    marginTop: 8,
  },
  priceTag: {
    fontFamily: "monospace",
    fontSize: 13,
    marginBottom: 4,
  },
  priceNote: {
    fontFamily: "monospace",
    fontSize: 12,
  },
  footer: {
    padding: 12,
    paddingTop: 0,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    alignSelf: 'center',
  },
  buttonText: {
    fontFamily: "monospace",
    fontSize: 13,
  },
});