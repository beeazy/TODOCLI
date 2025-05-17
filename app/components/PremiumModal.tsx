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
  onShowPrivacy?: () => void;
  onShowTerms?: () => void;
}

const PremiumModal = ({ 
  visible, 
  onClose, 
  theme, 
  onUpgrade, 
  isPremium, 
  isUpgrading,
  onShowPrivacy,
  onShowTerms 
}: PremiumModalProps) => {
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
              {isPremium ? "PRO FEATURES" : "UPGRADE TO PRO"}
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

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <View style={styles.legalLinks}>
              <TouchableOpacity
                style={styles.legalLink}
                onPress={onShowPrivacy}
              >
                <Text style={[styles.legalLinkText, { color: theme.accent }]}>
                  Privacy Policy
                </Text>
              </TouchableOpacity>
              <Text style={[styles.legalLinkText, { color: theme.muted }]}>•</Text>
              <TouchableOpacity
                style={styles.legalLink}
                onPress={onShowTerms}
              >
                <Text style={[styles.legalLinkText, { color: theme.accent }]}>
                  Terms of Service
                </Text>
              </TouchableOpacity>
            </View>
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
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  legalLink: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  legalLinkText: {
    fontFamily: "monospace",
    fontSize: 12,
    letterSpacing: 0.5,
  },
});

export default PremiumModal;