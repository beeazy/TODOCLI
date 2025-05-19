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
    accent: "#39FF14",
    onAccent: "#FFFFFF",
    success: "#39FF14",
    error: "#FF4444",
    muted: "#666666",
    surface: "#111111",
    border: "#39FF14",
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
              $ theme --list
            </Text>
          </View>

          <ScrollView style={styles.themeList}>
            {Object.entries(themes).map(([key, themeOption]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.themeButton,
                  {
                    backgroundColor: 'transparent',
                    borderColor: key === currentTheme ? themeOption.accent : 'transparent',
                    borderLeftWidth: key === currentTheme ? 2 : 0,
                  }
                ]}
                onPress={() => {
                  onSelectTheme(key);
                  onClose();
                }}
              >
                <Text style={[styles.themeName, { 
                  color: key === currentTheme ? themeOption.accent : theme.foreground,
                  marginLeft: key === currentTheme ? 8 : 10,
                }]}>
                  {key === currentTheme ? '>' : ' '} {themeOption.name}
                </Text>
                <View style={styles.themePreview}>
                  <Text style={[styles.previewText, { color: themeOption.accent }]}>■</Text>
                  <Text style={[styles.previewText, { color: themeOption.success }]}>■</Text>
                  <Text style={[styles.previewText, { color: themeOption.error }]}>■</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

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
    maxHeight: "90%",
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
  themeList: {
    padding: 12,
  },
  themeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  themeName: {
    fontFamily: "monospace",
    fontSize: 13,
    marginBottom: 6,
  },
  themePreview: {
    flexDirection: "row",
    gap: 4,
    marginLeft: 16,
  },
  previewText: {
    fontFamily: "monospace",
    fontSize: 16,
  },
  footer: {
    padding: 12,
    alignItems: "flex-start",
    paddingLeft: 24,
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 0,
    borderWidth: 0,
  },
  buttonText: {
    fontFamily: "monospace",
    fontSize: 13,
  },
}); 