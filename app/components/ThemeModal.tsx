import React from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Theme } from '../types';

interface ThemeModalProps {
  visible: boolean;
  onClose: () => void;
  currentTheme: string;
  onSelectTheme: (themeName: string) => void;
}

export const themes: Record<string, Theme> = {
  matrix: {
    name: "Matrix",
    background: "#000000",
    foreground: "#FFFFFF",
    accent: "#00FF00",
    onAccent: "#FFFFFF",
    success: "#00FF00",
    error: "#FF4444",
    muted: "#666666",
    surface: "#111111",
    border: "#00FF00",
  },
  dracula: {
    name: "Dracula",
    background: "#282A36",
    foreground: "#F8F8F2",
    accent: "#BD93F9",
    onAccent: "#FFFFFF",
    success: "#50FA7B",
    error: "#FF5555",
    muted: "#6272A4",
    surface: "#44475A",
    border: "#BD93F9",
  },
  monokai: {
    name: "Monokai",
    background: "#272822",
    foreground: "#F8F8F2",
    accent: "#FD971F",
    onAccent: "#FFFFFF",
    success: "#A6E22E",
    error: "#F92672",
    muted: "#75715E",
    surface: "#3E3D32",
    border: "#FD971F",
  },
  solarizedDark: {
    name: "Solarized Dark",
    background: "#002B36",
    foreground: "#839496",
    accent: "#268BD2",
    onAccent: "#FFFFFF",
    success: "#859900",
    error: "#DC322F",
    muted: "#586E75",
    surface: "#073642",
    border: "#268BD2",
  },
  nord: {
    name: "Nord",
    background: "#2E3440",
    foreground: "#D8DEE9",
    accent: "#88C0D0",
    onAccent: "#FFFFFF",
    success: "#A3BE8C",
    error: "#BF616A",
    muted: "#4C566A",
    surface: "#3B4252",
    border: "#88C0D0",
  },
};

export default function ThemeModal({
  visible,
  onClose,
  currentTheme,
  onSelectTheme,
}: ThemeModalProps) {
  const theme = themes[currentTheme];

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
              SELECT THEME
            </Text>
          </View>

          <ScrollView style={styles.themeList}>
            {Object.entries(themes).map(([key, themeOption]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.themeButton,
                  {
                    backgroundColor: themeOption.background,
                    borderColor: key === currentTheme ? themeOption.accent : themeOption.border,
                    borderWidth: key === currentTheme ? 2 : 1,
                  }
                ]}
                onPress={() => {
                  onSelectTheme(key);
                  onClose();
                }}
              >
                <Text style={[styles.themeName, { color: themeOption.accent }]}>
                  {themeOption.name}
                </Text>
                <View style={styles.themePreview}>
                  <View style={[styles.previewBox, { backgroundColor: themeOption.accent }]} />
                  <View style={[styles.previewBox, { backgroundColor: themeOption.success }]} />
                  <View style={[styles.previewBox, { backgroundColor: themeOption.error }]} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, { borderColor: theme.accent }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: theme.accent }]}>
                Close
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
    maxHeight: "90%",
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
  themeList: {
    padding: 20,
  },
  themeButton: {
    padding: 16,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
  },
  themeName: {
    fontFamily: "monospace",
    fontSize: 16,
    marginBottom: 12,
  },
  themePreview: {
    flexDirection: "row",
    gap: 8,
  },
  previewBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  footer: {
    padding: 20,
    alignItems: "center",
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