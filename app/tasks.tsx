import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import PremiumModal from './components/PremiumModal';
import TabBar from './components/TabBar';
import TaskItem from './components/TaskItem';
import ThemeModal, { themes } from './components/ThemeModal';
import { Theme } from './types';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
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
  premiumButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 4,
  },
  premiumButtonText: {
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
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
  buttonText: {
    fontFamily: "monospace",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  errorText: {
    fontFamily: 'monospace',
    fontSize: 12,
    marginTop: 8,
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
  taskList: {
    flex: 1,
    marginHorizontal: 8,
  },
  taskListContent: {
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
});

const THEME_STORAGE_KEY = "@terminal_todo_theme";
const PREMIUM_STORAGE_KEY = "@terminal_todo_premium";

// Define the Task interface with tab support
interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  tabId: string;
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

// Add Tab interface
interface Tab {
  id: string;
  title: string;
}

const TABS_STORAGE_KEY = '@terminal_todo_tabs';

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentTheme, setCurrentTheme] = useState<string>("matrix");
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
  const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>([{ id: '1', title: 'Main' }]);
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => {
    loadTabs();
    loadTasks();
    loadTheme();
    loadPremiumStatus();
  }, []);

  const loadTabs = async () => {
    try {
      const storedTabs = await AsyncStorage.getItem(TABS_STORAGE_KEY);
      if (storedTabs) {
        const parsedTabs = JSON.parse(storedTabs);
        setTabs(parsedTabs);
        if (!parsedTabs.find((tab: Tab) => tab.id === activeTab)) {
          setActiveTab(parsedTabs[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading tabs:', error);
    }
  };

  const saveTabs = async (updatedTabs: Tab[]) => {
    try {
      await AsyncStorage.setItem(TABS_STORAGE_KEY, JSON.stringify(updatedTabs));
    } catch (error) {
      console.error('Error saving tabs:', error);
    }
  };

  const addTab = () => {
    const newTabNumber = tabs.length + 1;
    const newTab = {
      id: newTabNumber.toString(),
      title: `Tab ${newTabNumber}`,
    };
    const updatedTabs = [...tabs, newTab];
    setTabs(updatedTabs);
    setActiveTab(newTab.id);
    saveTabs(updatedTabs);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length <= 1) return;
    
    const updatedTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(updatedTabs);
    
    // Move tasks from closed tab to first tab
    const updatedTasks = tasks.map(task => 
      task.tabId === tabId ? { ...task, tabId: updatedTabs[0].id } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    if (activeTab === tabId) {
      setActiveTab(updatedTabs[0].id);
    }
    
    saveTabs(updatedTabs);
  };

  const STORAGE_KEY = '@terminal_todo_app';

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

  const addTask = () => {
    if (newTask.trim() === "") return;

    const newTaskItem: Task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
      createdAt: new Date().toISOString(),
      tabId: activeTab,
    };

    const updatedTasks = [...tasks, newTaskItem];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setNewTask("");
    setIsAddingTask(false);
  };

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const getCompletionPercentage = (): number => {
    const filteredTasks = tasks.filter(task => task.tabId === activeTab);
    if (filteredTasks.length === 0) return 100;
    const completedCount = filteredTasks.filter(task => task.completed).length;
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
          backgroundColor: themes[currentTheme].surface,
          borderColor: themes[currentTheme].border,
          shadowColor: themes[currentTheme].accent,
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
                    backgroundColor: themes[currentTheme].background,
                    borderWidth: 1,
                    borderColor: index < filledBlocks ? themes[currentTheme].accent : themes[currentTheme].border,
                    ...(index < filledBlocks && {
                      backgroundColor: themes[currentTheme].accent,
                      shadowColor: themes[currentTheme].accent,
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
            color: percentage === 100 ? themes[currentTheme].success : themes[currentTheme].accent,
            fontWeight: percentage === 100 ? 'bold' : 'normal'
          }
        ]}>
          {percentage}% COMPLETE
        </Text>
      </View>
    );
  };

  const renderStats = () => {
    const filteredTasks = tasks.filter(task => task.tabId === activeTab);
    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(task => task.completed).length;
    const percentage = ((completedTasks / totalTasks) * 100 || 0);

    return (
      <View style={[
        styles.statsContainer,
        {
          backgroundColor: themes[currentTheme].surface,
          borderColor: themes[currentTheme].border
        }
      ]}>
        <Text style={[styles.statsText, { color: themes[currentTheme].muted }]}>
          {completedTasks}/{totalTasks} Tasks Complete
        </Text>
        <Text style={[
          styles.statsText,
          { color: percentage === 100 ? themes[currentTheme].success : themes[currentTheme].muted }
        ]}>
          {percentage.toFixed(0)}% Progress
        </Text>
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

  const onPriorityChange = (id: string, priority: Task['priority']) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, priority } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const theme = themes[currentTheme];
  const filteredTasks = tasks.filter(task => task.tabId === activeTab);

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

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
  };

  const saveTheme = async (themeName: string) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, themeName);
      setCurrentTheme(themeName);
    } catch (error) {
      console.error("Error saving theme", error);
    }
  };

  return (
    <SafeAreaView style={[
      styles.safeArea,
      { backgroundColor: theme.background }
    ]}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={[
          styles.container,
          { backgroundColor: theme.background }
        ]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabPress={setActiveTab}
          onAddTab={addTab}
          onCloseTab={closeTab}
          theme={theme}
        />
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
              onEdit={handleTaskEdit}
              onDelete={deleteTask}
              onPriorityChange={onPriorityChange}
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
              setEditingTask(null);
            }
          }}
          initialValue={editingTask?.text || ""}
          title="EDIT TASK"
          theme={theme}
        />

        <ThemeModal
          visible={isThemeModalVisible}
          onClose={() => setIsThemeModalVisible(false)}
          currentTheme={currentTheme}
          onSelectTheme={saveTheme}
        />

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
