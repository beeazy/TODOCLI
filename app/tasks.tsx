import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from "react-native";

// Theme definitions
interface Theme {
  name: string;
  background: string;
  foreground: string;
  accent: string;
  onAccent: string;
  success: string;
  error: string;
  muted: string;
  surface: string;
  border: string;
}

const themes: Record<string, Theme> = {
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

const THEME_STORAGE_KEY = "@terminal_todo_theme";
const PREMIUM_STORAGE_KEY = "@terminal_todo_premium";

// Define the Task interface with category support
interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  category: string;
  priority?: 'P0' | 'P1' | 'P2' | 'P3';
}

interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (text: string) => void;
  initialValue: string;
  title: string;
  theme: Theme;
  isProject?: boolean;
}

const EditModal = ({ visible, onClose, onSave, initialValue, title, theme, isProject }: EditModalProps) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(initialValue);
    setError(null);
  }, [initialValue]);

  const handleSave = () => {
    const trimmedValue = value.trim();
    if (isProject && trimmedValue === '') {
      setError('Project name cannot be empty');
      return;
    }
    setError(null);
    onSave(value);
    onClose();
  };

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
            borderColor: error ? theme.error : theme.accent,
            shadowColor: error ? theme.error : theme.accent,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5
          }
        ]}>
          <View style={[styles.editHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: error ? theme.error : theme.accent }]}>
              {title}
            </Text>
          </View>
          
          <View style={[styles.editContainer, { backgroundColor: theme.background }]}>
            <View style={styles.inputWrapper}>
              <Text style={[styles.promptSymbol, { color: error ? theme.error : theme.accent }]}>
                &gt;
              </Text>
              <TextInput
                style={[styles.input, { 
                  color: theme.foreground,
                  backgroundColor: 'transparent'
                }]}
                value={value}
                onChangeText={(text) => {
                  setValue(text);
                  setError(null);
                }}
                placeholder="Enter new value..."
                placeholderTextColor={theme.muted}
                autoFocus
                selectionColor={theme.accent}
              />
            </View>
            {error && (
              <Text style={[styles.errorText, { color: theme.error }]}>
                {error}
              </Text>
            )}
          </View>

          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.button, { 
                backgroundColor: theme.accent,
                borderColor: theme.accent,
              }]}
              onPress={handleSave}
            >
              <Text style={[styles.buttonText, { color: theme.background }]}>
                Save
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { 
                backgroundColor: 'transparent',
                borderColor: theme.muted,
              }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: theme.muted }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const STORAGE_KEY = "@terminal_todo_app";
const CATEGORIES_KEY = "@terminal_todo_categories";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface TaskItemProps {
  item: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onPriorityChange?: (id: string, priority: Task['priority']) => void;
  onPremiumPrompt: () => void;
  theme: Theme;
  isPremium: boolean;
}

interface ThemedAlertProps {
  visible: boolean;
  title: string;
  message: string;
  actions: {
    text: string;
    style?: 'default' | 'cancel' | 'destructive';
    onPress: () => void;
  }[];
  theme: Theme;
  onDismiss: () => void;
}

const ThemedAlert = ({ visible, title, message, actions, theme, onDismiss }: ThemedAlertProps) => {
  if (!visible) return null;

  const getButtonStyle = (style?: 'default' | 'cancel' | 'destructive') => {
    switch (style) {
      case 'destructive':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.error,
        };
      case 'cancel':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.muted,
        };
      default:
        return {
          backgroundColor: theme.accent,
          borderColor: theme.accent,
        };
    }
  };

  const getTextStyle = (style?: 'default' | 'cancel' | 'destructive') => {
    switch (style) {
      case 'destructive':
        return { color: theme.error };
      case 'cancel':
        return { color: theme.muted };
      default:
        return { color: theme.background };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={[styles.alertOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.95)' }]}>
          <TouchableWithoutFeedback>
            <View style={[
              styles.alertContent,
              {
                backgroundColor: theme.surface,
                borderColor: theme.accent,
                shadowColor: theme.accent,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }
            ]}>
              <Text style={[styles.alertTitle, { color: theme.accent }]}>
                {title}
              </Text>
              <Text style={[styles.alertMessage, { color: theme.foreground }]}>
                {message}
              </Text>
              <View style={styles.alertActions}>
                {actions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.alertButton,
                      getButtonStyle(action.style),
                    ]}
                    onPress={action.onPress}
                  >
                    <Text style={[
                      styles.alertButtonText,
                      getTextStyle(action.style),
                    ]}>
                      {action.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const TaskItem = ({ 
  item, 
  onToggle, 
  onEdit, 
  onDelete, 
  onPriorityChange, 
  onPremiumPrompt,
  theme, 
  isPremium 
}: TaskItemProps) => {
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isPriorityMenuVisible, setIsPriorityMenuVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => onToggle(item.id));
  };

  const handleDelete = () => {
    setIsAlertVisible(true);
  };

  const handlePriorityClick = () => {
    if (!isPremium) {
      onPremiumPrompt();
      return;
    }
    setIsPriorityMenuVisible(true);
  };

  const renderPriorityButton = () => {
    const currentPriority = item.priority;
    const priorityColor = currentPriority ? PRIORITIES[currentPriority].color : theme.muted;

    return (
      <TouchableOpacity
        style={[styles.priorityButton, { borderColor: priorityColor }]}
        onPress={handlePriorityClick}
      >
        <Text style={[styles.priorityButtonText, { color: priorityColor }]}>
          {currentPriority || 'P?'}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderPriorityMenu = () => {
    if (!isPriorityMenuVisible) return null;

    return (
      <Modal
        visible={true}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsPriorityMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsPriorityMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <View 
              style={[
                styles.priorityMenu,
                { 
                  backgroundColor: theme.surface,
                  borderColor: theme.accent,
                }
              ]}
            >
              {Object.entries(PRIORITIES).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.priorityMenuItem,
                    { borderBottomColor: theme.border }
                  ]}
                  onPress={() => {
                    onPriorityChange?.(item.id, key as Task['priority']);
                    setIsPriorityMenuVisible(false);
                  }}
                >
                  <Text style={[styles.priorityMenuItemText, { color: value.color }]}>
                    {value.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <>
      <Animated.View
        style={[
          styles.taskItemContainer,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
            borderColor: item.priority ? PRIORITIES[item.priority].color : theme.border,
            backgroundColor: theme.surface,
          },
        ]}
      >
        <AnimatedTouchable style={styles.taskItem} onPress={handlePress}>
          <Text
            style={[
              styles.taskText,
              { color: theme.foreground },
              item.completed && [styles.taskTextCompleted, { color: theme.muted }]
            ]}
          >
            {item.completed ? "[✓] " : "[ ] "}
            {item.text}
          </Text>
        </AnimatedTouchable>
        <View style={styles.taskActions}>
          {renderPriorityButton()}
          <TouchableOpacity
            style={[styles.taskActionButton, { 
              backgroundColor: 'transparent',
              borderColor: theme.accent 
            }]}
            onPress={() => onEdit(item)}
          >
            <Text style={[styles.taskActionButtonText, { color: theme.accent }]}>
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.taskActionButton, { 
              backgroundColor: 'transparent',
              borderColor: theme.error
            }]}
            onPress={handleDelete}
          >
            <Text style={[styles.taskActionButtonText, { color: theme.error }]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {renderPriorityMenu()}
      
      <ThemedAlert
        visible={isAlertVisible}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        actions={[
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setIsAlertVisible(false),
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              setIsAlertVisible(false);
              Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }).start(() => onDelete(item.id));
            },
          },
        ]}
        theme={theme}
        onDismiss={() => setIsAlertVisible(false)}
      />
    </>
  );
};

interface ThemeModalProps {
  visible: boolean;
  onClose: () => void;
  currentTheme: string;
  onSelectTheme: (themeName: string) => void;
}

const ThemeModal = ({ visible, onClose, currentTheme, onSelectTheme }: ThemeModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: "rgba(0, 0, 0, 0.9)" }]}>
        <View style={[styles.modalContent, { backgroundColor: themes[currentTheme].surface }]}>
          <Text style={[styles.modalTitle, { color: themes[currentTheme].accent }]}>
            SELECT THEME
          </Text>
          <ScrollView style={styles.themeList}>
            {Object.entries(themes).map(([key, theme]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.themeItem,
                  {
                    backgroundColor:
                      currentTheme === key ? theme.surface : "transparent",
                    borderColor: theme.accent,
                  },
                ]}
                onPress={() => {
                  onSelectTheme(key);
                  onClose();
                }}
              >
                <View style={styles.themePreview}>
                  <View
                    style={[
                      styles.themeColor,
                      { backgroundColor: theme.background },
                    ]}
                  />
                  <View
                    style={[
                      styles.themeColor,
                      { backgroundColor: theme.accent },
                    ]}
                  />
                  <View
                    style={[
                      styles.themeColor,
                      { backgroundColor: theme.foreground },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.themeItemText,
                    { color: currentTheme === key ? theme.accent : theme.foreground },
                  ]}
                >
                  {theme.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={[styles.modalCloseButton, { borderColor: themes[currentTheme].accent }]}
            onPress={onClose}
          >
            <Text style={[styles.closeButtonText, { color: themes[currentTheme].accent }]}>
              CLOSE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

interface StylesType {
  safeArea: ViewStyle;
  container: ViewStyle;
  header: ViewStyle;
  headerTitle: TextStyle;
  themeButton: ViewStyle;
  themeButtonText: TextStyle;
  mainContent: ViewStyle;
  statsContainer: ViewStyle;
  statsText: TextStyle;
  progressBarContainer: ViewStyle;
  progressBar: ViewStyle;
  progressBlock: ViewStyle;
  progressText: TextStyle;
  categoryContainer: ViewStyle;
  categoryButton: ViewStyle;
  categoryButtonText: TextStyle;
  modalOverlay: ViewStyle;
  modalContent: ViewStyle;
  modalTitle: TextStyle;
  themeList: ViewStyle;
  themeItem: ViewStyle;
  themePreview: ViewStyle;
  themeColor: ViewStyle;
  themeItemText: TextStyle;
  categoryList: ViewStyle;
  categoryItemContainer: ViewStyle;
  categoryItem: ViewStyle;
  categoryItemText: TextStyle;
  addCategoryContainer: ViewStyle;
  modalCloseButton: ViewStyle;
  closeButtonText: TextStyle;
  addButton: ViewStyle;
  addButtonText: TextStyle;
  addTaskContainer: ViewStyle;
  inputWrapper: ViewStyle;
  promptSymbol: TextStyle;
  input: TextStyle;
  buttonRow: ViewStyle;
  button: ViewStyle;
  deleteButton: ViewStyle;
  buttonText: TextStyle;
  taskList: ViewStyle;
  taskListContent: ViewStyle;
  taskItemContainer: ViewStyle;
  taskItem: ViewStyle;
  taskText: TextStyle;
  taskTextCompleted: TextStyle;
  editHeader: ViewStyle;
  editContainer: ViewStyle;
  editActions: ViewStyle;
  taskActions: ViewStyle;
  taskActionButton: ViewStyle;
  taskActionButtonText: TextStyle;
  alertOverlay: ViewStyle;
  alertContent: ViewStyle;
  alertTitle: TextStyle;
  alertMessage: TextStyle;
  alertActions: ViewStyle;
  alertButton: ViewStyle;
  alertButtonText: TextStyle;
  errorText: TextStyle;
  headerActions: ViewStyle;
  premiumButton: ViewStyle;
  premiumButtonText: TextStyle;
  premiumHeader: ViewStyle;
  premiumPrice: TextStyle;
  premiumPriceMonth: TextStyle;
  premiumSubtitle: TextStyle;
  premiumFeatureList: ViewStyle;
  premiumFeatureItem: ViewStyle;
  premiumFeatureIcon: TextStyle;
  premiumFeatureContent: ViewStyle;
  premiumFeatureTitle: TextStyle;
  premiumFeatureDescription: TextStyle;
  upgradeButton: ViewStyle;
  upgradeButtonText: TextStyle;
  priorityButton: ViewStyle;
  priorityButtonText: TextStyle;
  priorityMenu: ViewStyle;
  priorityMenuItem: ViewStyle;
  priorityMenuItemText: TextStyle;
}

const styles = StyleSheet.create<StylesType>({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 12 : (StatusBar.currentHeight ?? 24) + 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontFamily: "monospace",
    fontSize: 24,
    fontWeight: "bold",
  },
  themeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 4,
  },
  themeButtonText: {
    fontFamily: "monospace",
    fontSize: 14,
  },
  mainContent: {
    flex: 1,
    marginHorizontal: -8, // Compensate for inner padding
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  statsText: {
    fontFamily: "monospace",
    fontSize: 13,
  },
  progressBarContainer: {
    alignItems: "center",
    marginBottom: 28,
    marginHorizontal: 8,
    width: "auto",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  progressBar: {
    flexDirection: "row",
    marginBottom: 12,
    justifyContent: "center",
    gap: 4,
  },
  progressBlock: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  progressText: {
    fontFamily: "monospace",
    fontSize: 14,
    marginTop: 8,
    letterSpacing: 1,
  },
  categoryContainer: {
    marginBottom: 24,
    marginHorizontal: 8,
  },
  categoryButton: {
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
    borderRadius: 6,
  },
  categoryButtonText: {
    fontFamily: "monospace",
    fontSize: 16,
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 500,
    borderWidth: 1,
    padding: 24,
    maxHeight: "90%",
    borderRadius: 8,
  },
  modalTitle: {
    fontFamily: "monospace",
    fontSize: 20,
    marginBottom: 24,
    textAlign: "center",
    letterSpacing: 2,
  },
  themeList: {
    maxHeight: 400,
  },
  themeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  themePreview: {
    flexDirection: "row",
    marginRight: 16,
    gap: 6,
  },
  themeColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  themeItemText: {
    fontFamily: "monospace",
    fontSize: 16,
  },
  categoryList: {
    maxHeight: 300,
    marginBottom: 24,
  },
  categoryItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderRadius: 6,
    overflow: "hidden",
  },
  categoryItem: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  categoryItemText: {
    fontFamily: "monospace",
    fontSize: 15,
  },
  addCategoryContainer: {
    marginVertical: 16,
    borderWidth: 1,
    padding: 20,
    borderRadius: 6,
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 6,
  },
  closeButtonText: {
    fontFamily: "monospace",
    fontSize: 14,
    letterSpacing: 1,
  },
  addButton: {
    marginHorizontal: 8,
    marginVertical: 20,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 6,
  },
  addButtonText: {
    fontFamily: "monospace",
    fontSize: 16,
    letterSpacing: 1,
  },
  addTaskContainer: {
    marginHorizontal: 8,
    marginVertical: 20,
    borderWidth: 1,
    padding: 20,
    borderRadius: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  promptSymbol: {
    fontFamily: "monospace",
    fontSize: 18,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: "monospace",
    fontSize: 16,
    padding: 0,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  deleteButton: {
    borderColor: "#FF4444",
  },
  buttonText: {
    fontFamily: "monospace",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  taskList: {
    flex: 1,
    marginHorizontal: 8,
  },
  taskListContent: {
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  taskItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
  },
  taskItem: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  taskText: {
    fontFamily: "monospace",
    fontSize: 15,
    lineHeight: 22,
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
  },
  editHeader: {
    borderBottomWidth: 1,
    paddingBottom: 16,
    marginBottom: 24,
  },
  editContainer: {
    padding: 16,
    borderRadius: 6,
    marginBottom: 24,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 12,
  },
  taskActionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    minWidth: 70,
    alignItems: 'center',
  },
  taskActionButtonText: {
    fontFamily: "monospace",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  alertOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContent: {
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderRadius: 8,
    padding: 24,
  },
  alertTitle: {
    fontFamily: 'monospace',
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 1,
  },
  alertMessage: {
    fontFamily: 'monospace',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  alertActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  alertButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  alertButtonText: {
    fontFamily: 'monospace',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  errorText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#FF4444',
    marginTop: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  premiumButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.1)', // Subtle gold background
  },
  premiumButtonText: {
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: '600',
  },
  premiumHeader: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 16,
  },
  premiumPrice: {
    fontFamily: 'monospace',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  premiumPriceMonth: {
    fontSize: 20,
    fontWeight: 'normal',
  },
  premiumSubtitle: {
    fontFamily: 'monospace',
    fontSize: 16,
  },
  premiumFeatureList: {
    marginBottom: 24,
  },
  premiumFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  premiumFeatureIcon: {
    fontFamily: 'monospace',
    fontSize: 24,
    marginRight: 16,
    width: 40,
  },
  premiumFeatureContent: {
    flex: 1,
  },
  premiumFeatureTitle: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  premiumFeatureDescription: {
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 20,
  },
  upgradeButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  upgradeButtonText: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  priorityButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 8,
  },
  priorityButtonText: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '600',
  },
  priorityMenu: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    width: 120,
    marginLeft: -60,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  priorityMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  priorityMenuItemText: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

interface ThemedStylesType {
  safeArea: ViewStyle;
  container: ViewStyle;
  header: ViewStyle;
  headerTitle: TextStyle;
  input: ViewStyle;
  inputText: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  listItem: ViewStyle;
  listItemText: TextStyle;
  editModal: ViewStyle;
  editHeader: ViewStyle;
  alertContent: ViewStyle;
  alertTitle: TextStyle;
  alertMessage: TextStyle;
  alertButton: ViewStyle;
  alertButtonText: TextStyle;
}

const getThemedStyles = (theme: Theme): ThemedStylesType => ({
  safeArea: {
    backgroundColor: theme.background,
  },
  container: {
    backgroundColor: theme.background,
  },
  header: {
    borderBottomColor: theme.border,
  },
  headerTitle: {
    color: theme.foreground,
  },
  input: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
  },
  inputText: {
    color: theme.foreground,
  },
  button: {
    backgroundColor: theme.accent,
  },
  buttonText: {
    color: theme.onAccent,
  },
  listItem: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
  },
  listItemText: {
    color: theme.foreground,
  },
  editModal: {
    backgroundColor: theme.background,
  },
  editHeader: {
    borderBottomColor: theme.border,
  },
  alertContent: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderWidth: 1,
  },
  alertTitle: {
    color: theme.foreground,
  },
  alertMessage: {
    color: theme.foreground,
  },
  alertButton: {
    backgroundColor: 'transparent',
  },
  alertButtonText: {
    color: theme.accent,
  },
});

interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  icon: string; // ASCII art icon
}

const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    id: 'priorities',
    title: 'Priority Levels',
    description: 'Add P0-P3 priority levels to your tasks',
    icon: '[!]',
  },
  {
    id: 'recurring',
    title: 'Recurring Tasks',
    description: 'Create daily, weekly, or monthly recurring tasks',
    icon: '[↻]',
  },
  {
    id: 'themes',
    title: 'Custom Themes',
    description: 'Create and customize your own themes',
    icon: '[⚙]',
  },
  {
    id: 'backup',
    title: 'Cloud Backup',
    description: 'Secure cloud backup of your tasks and settings',
    icon: '[☁]',
  },
  {
    id: 'commands',
    title: 'Command Palette',
    description: 'Quick actions with keyboard shortcuts',
    icon: '[/]',
  },
];

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  theme: Theme;
  onUpgrade: () => void;
  isPremium: boolean;
  isUpgrading?: boolean;
}

const PremiumModal = ({ visible, onClose, theme, onUpgrade, isPremium, isUpgrading }: PremiumModalProps) => {
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
            maxWidth: 600,
          }
        ]}>
          <Text style={[styles.modalTitle, { color: theme.accent }]}>
            {isPremium ? 'PRO FEATURES' : 'UPGRADE TO PRO'}
          </Text>

          <View style={styles.premiumHeader}>
            <Text style={[styles.premiumPrice, { color: theme.foreground }]}>
              $2
              <Text style={[styles.premiumPriceMonth, { color: theme.muted }]}>/month</Text>
            </Text>
            <Text style={[styles.premiumSubtitle, { color: theme.muted }]}>
              {isUpgrading ? 'Processing upgrade...' : 'Unlock all premium features'}
            </Text>
          </View>

          <ScrollView style={styles.premiumFeatureList}>
            {PREMIUM_FEATURES.map((feature) => (
              <View 
                key={feature.id}
                style={[styles.premiumFeatureItem, { borderColor: theme.border }]}
              >
                <Text style={[styles.premiumFeatureIcon, { color: theme.accent }]}>
                  {feature.icon}
                </Text>
                <View style={styles.premiumFeatureContent}>
                  <Text style={[styles.premiumFeatureTitle, { color: theme.foreground }]}>
                    {feature.title}
                  </Text>
                  <Text style={[styles.premiumFeatureDescription, { color: theme.muted }]}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {!isPremium && (
            <TouchableOpacity
              style={[
                styles.upgradeButton, 
                { 
                  backgroundColor: isUpgrading ? theme.muted : theme.accent,
                  opacity: isUpgrading ? 0.7 : 1,
                }
              ]}
              onPress={onUpgrade}
              disabled={isUpgrading}
            >
              <Text style={[styles.upgradeButtonText, { color: theme.background }]}>
                {isUpgrading ? 'PROCESSING...' : 'UPGRADE NOW'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.modalCloseButton, { borderColor: theme.accent }]}
            onPress={onClose}
            disabled={isUpgrading}
          >
            <Text style={[styles.closeButtonText, { color: theme.accent }]}>
              {isPremium ? 'CLOSE' : 'MAYBE LATER'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

type PriorityLevel = 'P0' | 'P1' | 'P2' | 'P3';

interface Priority {
  label: string;
  color: string;
}

const PRIORITIES: Record<PriorityLevel, Priority> = {
  P0: { label: 'P0', color: '#FF453A' },
  P1: { label: 'P1', color: '#FF9F0A' },
  P2: { label: 'P2', color: '#32D74B' },
  P3: { label: 'P3', color: '#64D2FF' },
};

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [categories, setCategories] = useState<string[]>(["Uncategorized"]);
  const [selectedCategory, setSelectedCategory] = useState("Uncategorized");
  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<string>("matrix");
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
  const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);
  const [isDeleteCategoryAlertVisible, setIsDeleteCategoryAlertVisible] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    loadTasks();
    loadCategories();
    loadTheme();
    loadPremiumStatus();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Error loading tasks", error);
    }
  };

  const loadCategories = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem(CATEGORIES_KEY);
      if (storedCategories !== null) {
        setCategories(JSON.parse(storedCategories));
      }
    } catch (error) {
      console.error("Error loading categories", error);
    }
  };

  const loadTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme !== null) {
        setCurrentTheme(storedTheme);
      }
    } catch (error) {
      console.error("Error loading theme", error);
    }
  };

  const loadPremiumStatus = async () => {
    try {
      const storedPremium = await AsyncStorage.getItem(PREMIUM_STORAGE_KEY);
      if (storedPremium === 'true') {
        setIsPremium(true);
      }
    } catch (error) {
      console.error("Error loading premium status", error);
    }
  };

  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Error saving tasks", error);
    }
  };

  const saveCategories = async (updatedCategories: string[]) => {
    try {
      await AsyncStorage.setItem(
        CATEGORIES_KEY,
        JSON.stringify(updatedCategories)
      );
    } catch (error) {
      console.error("Error saving categories", error);
    }
  };

  const saveTheme = async (themeName: string) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, themeName);
      setCurrentTheme(themeName);
    } catch (error) {
      console.error("Error saving theme", error);
    }
  };

  const addTask = () => {
    if (newTask.trim() === "") return;

    const newTaskItem: Task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
      createdAt: new Date().toISOString(),
      category: selectedCategory,
    };

    const updatedTasks = [...tasks, newTaskItem];

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setNewTask("");
    setIsAddingTask(false);
  };

  const addCategory = () => {
    if (newCategory.trim() === "" || categories.includes(newCategory.trim()))
      return;

    const updatedCategories = [...categories, newCategory.trim()];
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    setNewCategory("");
    setIsAddingCategory(false);
    setSelectedCategory(newCategory.trim());
  };

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const getCompletionPercentage = (): number => {
    const filteredTasks = tasks.filter(
      (task) => task.category === selectedCategory
    );
    if (filteredTasks.length === 0) return 100;
    const completedCount = filteredTasks.filter(
      (task) => task.completed
    ).length;
    return Math.round((completedCount / filteredTasks.length) * 100);
  };

  const renderProgressBar = () => {
    const percentage = getCompletionPercentage();
    const blocks = 10;
    const filledBlocks = Math.round((percentage / 100) * blocks);

    return (
      <View style={[
        styles.progressBarContainer,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          shadowColor: theme.accent,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3
        }
      ]}>
        <View style={styles.progressBar}>
          {Array(blocks)
            .fill(0)
            .map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressBlock,
                  {
                    backgroundColor: theme.background,
                    borderWidth: 1,
                    borderColor: index < filledBlocks ? theme.accent : theme.border,
                    ...(index < filledBlocks && {
                      backgroundColor: theme.accent,
                      shadowColor: theme.accent,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 2,
                      elevation: 2
                    })
                  }
                ]}
              />
            ))}
        </View>
        <Text style={[
          styles.progressText,
          {
            color: percentage === 100 ? theme.success : theme.accent,
            fontWeight: percentage === 100 ? 'bold' : 'normal'
          }
        ]}>
          {percentage}% COMPLETE
        </Text>
      </View>
    );
  };

  const renderStats = () => {
    const filteredTasks = tasks.filter(
      (task) => task.category === selectedCategory
    );
    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter((task) => task.completed).length;
    const percentage = ((completedTasks / totalTasks) * 100 || 0);

    return (
      <View style={[
        styles.statsContainer,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border
        }
      ]}>
        <Text style={[styles.statsText, { color: theme.muted }]}>
          {completedTasks}/{totalTasks} Tasks Complete
        </Text>
        <Text style={[
          styles.statsText,
          { color: percentage === 100 ? theme.success : theme.muted }
        ]}>
          {percentage.toFixed(0)}% Progress
        </Text>
      </View>
    );
  };

  const renderCategorySelector = () => {
    return (
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[styles.categoryButton, { 
            backgroundColor: themes[currentTheme].surface,
            borderColor: themes[currentTheme].accent 
          }]}
          onPress={() => setIsCategoryModalVisible(true)}
        >
          <Text style={[styles.categoryButtonText, { color: themes[currentTheme].accent }]}>
            PROJECT: {selectedCategory}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const updateTask = (taskId: string, newText: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, text: newText } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const updateCategory = (oldCategory: string, newCategory: string) => {
    const trimmedCategory = newCategory.trim();
    if (trimmedCategory === '' || categories.includes(trimmedCategory)) {
      setEditingCategory(null);
      return;
    }
    
    const updatedCategories = categories.map(cat =>
      cat === oldCategory ? trimmedCategory : cat
    );
    
    const updatedTasks = tasks.map(task =>
      task.category === oldCategory ? { ...task, category: trimmedCategory } : task
    );

    setCategories(updatedCategories);
    setTasks(updatedTasks);
    if (selectedCategory === oldCategory) {
      setSelectedCategory(trimmedCategory);
    }
    
    saveCategories(updatedCategories);
    saveTasks(updatedTasks);
    setEditingCategory(null);
  };

  const deleteCategory = (category: string) => {
    if (category === "Uncategorized") return;
    setDeletingCategory(category);
    setIsDeleteCategoryAlertVisible(true);
  };

  const handleConfirmDeleteCategory = (category: string) => {
    const updatedCategories = categories.filter((cat) => cat !== category);
    const updatedTasks = tasks.map((task) =>
      task.category === category
        ? { ...task, category: "Uncategorized" }
        : task
    );

    setCategories(updatedCategories);
    setTasks(updatedTasks);
    if (selectedCategory === category) {
      setSelectedCategory("Uncategorized");
    }

    saveCategories(updatedCategories);
    saveTasks(updatedTasks);
    setIsDeleteCategoryAlertVisible(false);
    setDeletingCategory(null);
  };

  const renderCategoryModal = () => {
    return (
      <Modal
        visible={isCategoryModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themes[currentTheme].surface }]}>
            <Text style={[styles.modalTitle, { color: themes[currentTheme].accent }]}>
              SELECT PROJECT
            </Text>

            <ScrollView style={styles.categoryList}>
              {categories.map((category, index) => (
                <View key={index} style={[
                  styles.categoryItemContainer,
                  { backgroundColor: themes[currentTheme].surface }
                ]}>
                  <TouchableOpacity
                    style={[
                      styles.categoryItem,
                      selectedCategory === category && { backgroundColor: themes[currentTheme].surface },
                    ]}
                    onPress={() => {
                      setSelectedCategory(category);
                      setIsCategoryModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.categoryItemText,
                        { color: themes[currentTheme].foreground },
                        selectedCategory === category && { color: themes[currentTheme].accent },
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                  {category !== "Uncategorized" && (
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={[styles.button, { 
                          backgroundColor: themes[currentTheme].surface,
                          borderColor: themes[currentTheme].accent 
                        }]}
                        onPress={() => setEditingCategory(category)}
                      >
                        <Text style={[styles.buttonText, { color: themes[currentTheme].accent }]}>
                          Edit
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, { 
                          backgroundColor: themes[currentTheme].surface,
                          borderColor: themes[currentTheme].error
                        }]}
                        onPress={() => deleteCategory(category)}
                      >
                        <Text style={[styles.buttonText, { color: themes[currentTheme].error }]}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            {isAddingCategory ? (
              <View style={[styles.addCategoryContainer, { 
                backgroundColor: themes[currentTheme].surface,
                borderColor: themes[currentTheme].accent 
              }]}>
                <View style={[styles.inputWrapper, { backgroundColor: themes[currentTheme].surface }]}>
                  <Text style={[styles.promptSymbol, { color: themes[currentTheme].accent }]}>
                    &gt;
                  </Text>
                  <TextInput
                    style={[styles.input, { 
                      color: themes[currentTheme].foreground,
                      backgroundColor: themes[currentTheme].surface
                    }]}
                    value={newCategory}
                    onChangeText={setNewCategory}
                    placeholder="New project name..."
                    placeholderTextColor={themes[currentTheme].muted}
                    autoFocus
                    selectionColor={themes[currentTheme].accent}
                  />
                </View>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, { 
                      backgroundColor: themes[currentTheme].surface,
                      borderColor: themes[currentTheme].accent 
                    }]}
                    onPress={addCategory}
                  >
                    <Text style={[styles.buttonText, { color: themes[currentTheme].accent }]}>
                      Add
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { 
                      backgroundColor: themes[currentTheme].surface,
                      borderColor: themes[currentTheme].accent 
                    }]}
                    onPress={() => {
                      setNewCategory("");
                      setIsAddingCategory(false);
                    }}
                  >
                    <Text style={[styles.buttonText, { color: themes[currentTheme].accent }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.addButton, { 
                  backgroundColor: themes[currentTheme].surface,
                  borderColor: themes[currentTheme].accent 
                }]}
                onPress={() => setIsAddingCategory(true)}
              >
                <Text style={[styles.addButtonText, { color: themes[currentTheme].accent }]}>
                  + ADD PROJECT
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  const filteredTasks = tasks.filter(
    (task) => task.category === selectedCategory
  );

  const theme = themes[currentTheme];
  const themedStyles = getThemedStyles(theme);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save premium status
      await AsyncStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
      setIsPremium(true);
      setIsPremiumModalVisible(false);
      
      // Show success message
      Alert.alert(
        "Upgrade Successful!",
        "Thank you for upgrading to Pro! All premium features are now unlocked.",
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert(
        "Upgrade Failed",
        "There was an error processing your upgrade. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, themedStyles.safeArea]}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={[styles.container, themedStyles.container]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.accent }]}>
            TODO CLI
          </Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.premiumButton, { borderColor: theme.accent }]}
              onPress={() => setIsPremiumModalVisible(true)}
            >
              <Text style={[styles.premiumButtonText, { color: theme.accent }]}>
                PRO
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.themeButton, { borderColor: theme.accent }]}
              onPress={() => setIsThemeModalVisible(true)}
            >
              <Text style={[styles.themeButtonText, { color: theme.accent }]}>
                THEME
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {renderProgressBar()}
        {renderStats()}
        {renderCategorySelector()}
        {renderCategoryModal()}

        {isAddingTask ? (
          <View style={[styles.addTaskContainer, { 
            backgroundColor: theme.surface,
            borderColor: theme.accent 
          }]}>
            <View style={[styles.inputWrapper, { backgroundColor: theme.surface }]}>
              <Text style={[styles.promptSymbol, { color: theme.accent }]}>
                &gt;
              </Text>
              <TextInput
                style={[styles.input, { 
                  color: theme.foreground,
                  backgroundColor: theme.surface
                }]}
                value={newTask}
                onChangeText={setNewTask}
                placeholder="Enter task..."
                placeholderTextColor={theme.muted}
                autoFocus
                selectionColor={theme.accent}
                returnKeyType="done"
                onSubmitEditing={addTask}
              />
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, { 
                  backgroundColor: theme.surface,
                  borderColor: theme.accent 
                }]}
                onPress={addTask}
              >
                <Text style={[styles.buttonText, { color: theme.accent }]}>
                  Add
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { 
                  backgroundColor: theme.surface,
                  borderColor: theme.accent 
                }]}
                onPress={() => {
                  setNewTask("");
                  setIsAddingTask(false);
                }}
              >
                <Text style={[styles.buttonText, { color: theme.accent }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.addButton, { 
              backgroundColor: theme.surface,
              borderColor: theme.accent 
            }]}
            onPress={() => setIsAddingTask(true)}
          >
            <Text style={[styles.addButtonText, { color: theme.accent }]}>
              + ADD TASK
            </Text>
          </TouchableOpacity>
        )}

        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              item={item}
              onToggle={toggleTask}
              onEdit={setEditingTask}
              onDelete={deleteTask}
              onPriorityChange={(id, priority) => {
                const updatedTasks = tasks.map(task =>
                  task.id === id ? { ...task, priority } : task
                );
                setTasks(updatedTasks);
                saveTasks(updatedTasks);
              }}
              onPremiumPrompt={() => setIsPremiumModalVisible(true)}
              theme={theme}
              isPremium={isPremium}
            />
          )}
          style={styles.taskList}
          contentContainerStyle={styles.taskListContent}
          showsVerticalScrollIndicator={false}
        />

        <EditModal
          visible={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(newText) => {
            if (editingTask) {
              updateTask(editingTask.id, newText);
            }
          }}
          initialValue={editingTask?.text || ""}
          title="EDIT TASK"
          theme={theme}
        />

        <EditModal
          visible={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={(newCategory) => {
            if (editingCategory) {
              updateCategory(editingCategory, newCategory);
            }
          }}
          initialValue={editingCategory || ""}
          title="EDIT PROJECT"
          theme={theme}
          isProject
        />

        <ThemeModal
          visible={isThemeModalVisible}
          onClose={() => setIsThemeModalVisible(false)}
          currentTheme={currentTheme}
          onSelectTheme={saveTheme}
        />

        {deletingCategory && (
          <ThemedAlert
            visible={isDeleteCategoryAlertVisible}
            title="Delete Project"
            message={`Are you sure you want to delete "${deletingCategory}"? All tasks will be moved to Uncategorized.`}
            actions={[
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => {
                  setIsDeleteCategoryAlertVisible(false);
                  setDeletingCategory(null);
                },
              },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => handleConfirmDeleteCategory(deletingCategory),
              },
            ]}
            theme={theme}
            onDismiss={() => {
              setIsDeleteCategoryAlertVisible(false);
              setDeletingCategory(null);
            }}
          />
        )}

        <PremiumModal
          visible={isPremiumModalVisible}
          onClose={() => setIsPremiumModalVisible(false)}
          theme={theme}
          onUpgrade={handleUpgrade}
          isPremium={isPremium}
          isUpgrading={isUpgrading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
