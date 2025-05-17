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
import LegalModal from './components/LegalModal';
import OnboardingScreen from './components/OnboardingScreen';
import PremiumModal from './components/PremiumModal';
import TabBar from './components/TabBar';
import TaskItem from './components/TaskItem';
import ThemeModal, { themes } from './components/ThemeModal';
import ThemedAlert from './components/ThemedAlert';
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from './constants/legal';
import { analytics } from './services/analytics';
import { Theme } from './types';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : (StatusBar.currentHeight ?? 24) + 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontFamily: "monospace",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  headerButtonText: {
    fontFamily: "monospace",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  progressBarContainer: {
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  progressBar: {
    flexDirection: "row",
    marginBottom: 8,
    justifyContent: "center",
    gap: 2,
  },
  progressBlock: {
    width: 16,
    height: 16,
    borderRadius: 2,
  },
  progressText: {
    fontFamily: "monospace",
    fontSize: 13,
    textAlign: 'center',
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  statsText: {
    fontFamily: "monospace",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  addTaskContainer: {
    marginVertical: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  promptSymbol: {
    fontFamily: "monospace",
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: "monospace",
    fontSize: 14,
    padding: 0,
    height: 24,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  buttonText: {
    fontFamily: "monospace",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  addButton: {
    marginVertical: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  addButtonText: {
    fontFamily: "monospace",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  taskList: {
    flex: 1,
  },
  taskListContent: {
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    maxWidth: 500,
    padding: 16,
    maxHeight: "90%",
  },
  modalTitle: {
    fontFamily: "monospace",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 1,
  },
  editHeader: {
    borderBottomWidth: 1,
    paddingBottom: 12,
    marginBottom: 16,
  },
  editContainer: {
    padding: 12,
    marginBottom: 16,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  errorText: {
    fontFamily: 'monospace',
    fontSize: 12,
    marginTop: 8,
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
    if (!trimmedValue) {
      setError('Task cannot be empty');
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
                returnKeyType="done"
                onSubmitEditing={handleSave}
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
                opacity: !value.trim() ? 0.5 : 1
              }]}
              onPress={handleSave}
              disabled={!value.trim()}
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

// Add helper function to generate unique IDs
function generateUniqueId(): string {
  return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Add helper function to generate unique tab name
function generateUniqueTabName(existingTabs: Tab[], baseName: string): string {
  // const existingNames = new Set(existingTabs.map(tab => tab.title));
  // let newName = baseName;
  // let counter = 1;
  
  // while (existingNames.has(newName)) {
  //   newName = `${baseName} ${counter}`;
  //   counter++;
  // }
  
  return "Tab";
}

// Add TypingText component at the top level
const TypingText = ({ text, style, onComplete }: { text: string; style: any; onComplete?: () => void }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const typingSpeed = 50; // ms per character

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return (
    <Text style={style}>
      {displayText}
      <Text style={[style, { opacity: 0.5 }]}>_</Text>
    </Text>
  );
};

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
  const [tabs, setTabs] = useState<Tab[]>([{ id: generateUniqueId(), title: 'Main' }]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [isCloseTabAlertVisible, setIsCloseTabAlertVisible] = useState(false);
  const [tabToClose, setTabToClose] = useState<Tab | null>(null);
  const [isDeleteTaskAlertVisible, setIsDeleteTaskAlertVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);

  const PRIORITY_ORDER: Task['priority'][] = ['P0', 'P1', 'P2', 'P3'];

  // Add helper function for sorting tasks
  const sortTasksByPriority = (tasks: Task[]): Task[] => {
    return [...tasks].sort((a, b) => {
      // First sort by priority
      const priorityA = a.priority ? PRIORITY_ORDER.indexOf(a.priority) : PRIORITY_ORDER.length;
      const priorityB = b.priority ? PRIORITY_ORDER.indexOf(b.priority) : PRIORITY_ORDER.length;
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // If priorities are equal, sort by completion status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // If completion status is equal, sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  useEffect(() => {
    loadTabs();
    loadTasks();
    loadTheme();
    loadPremiumStatus();
    checkFirstLaunch();
  }, []);

  const loadTabs = async () => {
    try {
      const storedTabs = await AsyncStorage.getItem(TABS_STORAGE_KEY);
      if (storedTabs) {
        const parsedTabs = JSON.parse(storedTabs);
        setTabs(parsedTabs);
        // Always set the first tab as active if no tab is selected
        if (!activeTab || !parsedTabs.find((tab: Tab) => tab.id === activeTab)) {
          setActiveTab(parsedTabs[0].id);
        }
      } else {
        // If no tabs exist in storage, create a default tab and set it as active
        const defaultTab = { id: generateUniqueId(), title: 'Main' };
        setTabs([defaultTab]);
        setActiveTab(defaultTab.id);
        await saveTabs([defaultTab]);
      }
    } catch (error) {
      console.error('Error loading tabs:', error);
      // Handle error by creating a default tab
      const defaultTab = { id: generateUniqueId(), title: 'Main' };
      setTabs([defaultTab]);
      setActiveTab(defaultTab.id);
      await saveTabs([defaultTab]);
    }
  };

  const saveTabs = async (updatedTabs: Tab[]) => {
    try {
      await AsyncStorage.setItem(TABS_STORAGE_KEY, JSON.stringify(updatedTabs));
    } catch (error) {
      console.error('Error saving tabs:', error);
    }
  };

  const addTab = async () => {
    const newTabName = generateUniqueTabName(tabs, 'Tab');
    const newTab = {
      id: generateUniqueId(),
      title: newTabName,
    };
    const updatedTabs = [...tabs, newTab];
    setTabs(updatedTabs);
    setActiveTab(newTab.id);
    await saveTabs(updatedTabs);
    analytics.trackTabCreated(newTab.id);
  };

  const closeTab = async (tabId: string) => {
    // Prevent closing if only one tab remains
    if (tabs.length <= 1) return;
    
    const tab = tabs.find(tab => tab.id === tabId);
    if (!tab) return;

    setTabToClose(tab);
    setIsCloseTabAlertVisible(true);
    await saveTabs(tabs.filter(t => t.id !== tabId));
    analytics.trackTabDeleted(tabId);
  };

  const handleCloseTab = () => {
    if (!tabToClose) return;

    const updatedTabs = tabs.filter(tab => tab.id !== tabToClose.id);
    setTabs(updatedTabs);
    
    // Move tasks from closed tab to first tab
    const updatedTasks = tasks.map(task => 
      task.tabId === tabToClose.id ? { ...task, tabId: updatedTabs[0].id } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    // If closing active tab, switch to first available tab
    if (activeTab === tabToClose.id) {
      setActiveTab(updatedTabs[0].id);
    }
    
    saveTabs(updatedTabs);
    setIsCloseTabAlertVisible(false);
    setTabToClose(null);
  };

  const STORAGE_KEY = '@terminal_todo_app';

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks !== null) {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks(sortTasksByPriority(parsedTasks));
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

  const addTask = async (taskText: string) => {
    // Ensure we have an active tab
    if (!activeTab) {
      const defaultTab = { id: generateUniqueId(), title: 'Main' };
      setTabs([defaultTab]);
      setActiveTab(defaultTab.id);
      await saveTabs([defaultTab]);
    }

    const newTask: Task = {
      id: generateUniqueId(),
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString(),
      tabId: activeTab,
    };
    const updatedTasks = sortTasksByPriority([...tasks, newTask]);
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
    analytics.trackTaskCreated(activeTab);
  };

  const toggleTask = async (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
    const task = updatedTasks.find(t => t.id === taskId);
    if (task) {
      analytics.trackTaskToggled(taskId, task.completed);
    }
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

  const updateTask = async (taskId: string, newText: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, text: newText };
      }
      return task;
    });
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
    analytics.trackTaskUpdated(taskId, activeTab);
  };

  const deleteTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    setTaskToDelete(task);
    setIsDeleteTaskAlertVisible(true);
  };

  const onPriorityChange = async (taskId: string, newPriority: Task['priority']) => {
    const updatedTasks = sortTasksByPriority(
      tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, priority: newPriority };
        }
        return task;
      })
    );
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
    analytics.trackPriorityChanged(taskId, newPriority || 'P?');
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
      analytics.trackPremiumUpgrade();
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
      analytics.trackThemeChanged(themeName);
    } catch (error) {
      console.error("Error saving theme", error);
    }
  };

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    analytics.trackTabViewed(tabId);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    
    const updatedTasks = tasks.filter(task => task.id !== taskToDelete.id);
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
    analytics.trackTaskDeleted(taskToDelete.id, activeTab);
    
    setIsDeleteTaskAlertVisible(false);
    setTaskToDelete(null);
  };

  const handlePremiumButtonClick = () => {
    analytics.trackButtonClick('premium', 'header');
    setIsPremiumModalVisible(true);
    analytics.trackModalOpened('premium');
  };

  const handleThemeButtonClick = () => {
    analytics.trackButtonClick('theme', 'header');
    setIsThemeModalVisible(true);
    analytics.trackModalOpened('theme');
  };

  const handleAddTaskClick = () => {
    analytics.trackButtonClick('add_task', 'main');
    setIsAddingTask(true);
  };

  const handleAddTaskSubmit = (taskText: string) => {
    const trimmedText = taskText.trim();
    if (!trimmedText) {
      return; // Don't add empty tasks
    }
    analytics.trackInputSubmit('add_task', 'task_input');
    addTask(trimmedText);
    setNewTask("");
    setIsAddingTask(false);
  };

  const handleCancelAddTask = () => {
    analytics.trackButtonClick('cancel_add_task', 'task_input');
    setNewTask("");
    setIsAddingTask(false);
  };

  const handleEditModalClose = () => {
    analytics.trackModalClosed('edit_task');
    setEditingTask(null);
  };

  const handleEditModalSave = (newText: string) => {
    const trimmedText = newText.trim();
    if (!trimmedText) {
      return; // Don't save empty tasks
    }
    if (editingTask) {
      analytics.trackModalAction('edit_task', 'save');
      updateTask(editingTask.id, trimmedText);
      setEditingTask(null);
    }
  };

  const handleThemeModalClose = () => {
    analytics.trackModalClosed('theme');
    setIsThemeModalVisible(false);
  };

  const handlePremiumModalClose = () => {
    analytics.trackModalClosed('premium');
    setIsPremiumModalVisible(false);
  };

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('@terminal_todo_has_launched');
      if (hasLaunched) {
        setShowOnboarding(false);
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('@terminal_todo_has_launched', 'true');
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error saving launch status:', error);
    }
  };

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} theme={themes[currentTheme]} />;
  }

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
          onTabPress={handleTabPress}
          onAddTab={addTab}
          onCloseTab={closeTab}
          theme={theme}
        />
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Text style={[styles.headerTitle, { color: theme.accent }]}>
            $ todo
          </Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handlePremiumButtonClick}
            >
              <Text style={[styles.headerButtonText, { color: theme.accent }]}>
                pro
              </Text>
            </TouchableOpacity>
            <Text style={[styles.headerButtonText, { color: theme.muted }]}>|</Text>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleThemeButtonClick}
            >
              <Text style={[styles.headerButtonText, { color: theme.accent }]}>
                theme
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {renderProgressBar()}
        {renderStats()}

        {isAddingTask ? (
          <View style={styles.addTaskContainer}>
            <View style={styles.inputWrapper}>
              <Text style={[styles.promptSymbol, { color: theme.accent }]}>
                $
              </Text>
              <TextInput
                style={[styles.input, { 
                  color: theme.foreground,
                }]}
                value={newTask}
                onChangeText={setNewTask}
                placeholder="add task..."
                placeholderTextColor={theme.muted}
                autoFocus
                selectionColor={theme.accent}
                returnKeyType="done"
                onSubmitEditing={() => handleAddTaskSubmit(newTask)}
              />
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, { 
                  opacity: !newTask.trim() ? 0.5 : 1 
                }]}
                onPress={() => handleAddTaskSubmit(newTask)}
                disabled={!newTask.trim()}
              >
                <Text style={[styles.buttonText, { color: theme.accent }]}>
                  add
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleCancelAddTask}
              >
                <Text style={[styles.buttonText, { color: theme.muted }]}>
                  cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddTaskClick}
          >
            <Text style={[styles.addButtonText, { color: theme.accent }]}>
              $ add task
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
          onClose={handleEditModalClose}
          onSave={handleEditModalSave}
          initialValue={editingTask?.text || ""}
          title="EDIT TASK"
          theme={theme}
        />

        <ThemeModal
          visible={isThemeModalVisible}
          onClose={handleThemeModalClose}
          currentTheme={currentTheme}
          onSelectTheme={saveTheme}
        />

        <PremiumModal
          visible={isPremiumModalVisible}
          onClose={handlePremiumModalClose}
          theme={theme}
          onUpgrade={handleUpgrade}
          isPremium={isPremium}
          isUpgrading={isUpgrading}
          onShowPrivacy={() => setIsPrivacyModalVisible(true)}
          onShowTerms={() => setIsTermsModalVisible(true)}
        />

        <ThemedAlert
          visible={isCloseTabAlertVisible}
          title="Close Tab"
          message={tabToClose ? `Are you sure you want to close "${tabToClose.title}"? Tasks in this tab will be moved to the first tab.` : ''}
          theme={theme}
          onDismiss={() => {
            setIsCloseTabAlertVisible(false);
            setTabToClose(null);
          }}
          actions={[
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => {
                setIsCloseTabAlertVisible(false);
                setTabToClose(null);
              }
            },
            {
              text: "Close",
              style: "destructive",
              onPress: handleCloseTab
            }
          ]}
        />

        <ThemedAlert
          visible={isDeleteTaskAlertVisible}
          title="rm -rf task"
          message={taskToDelete ? `Are you sure you want to delete "${taskToDelete.text}"?` : ''}
          theme={theme}
          onDismiss={() => setIsDeleteTaskAlertVisible(false)}
          actions={[
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => {
                setIsDeleteTaskAlertVisible(false);
                setTaskToDelete(null);
              }
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: handleDeleteTask
            }
          ]}
        />

        <LegalModal
          visible={isPrivacyModalVisible}
          onClose={() => setIsPrivacyModalVisible(false)}
          title="Privacy Policy"
          content={PRIVACY_POLICY}
          theme={theme}
        />

        <LegalModal
          visible={isTermsModalVisible}
          onClose={() => setIsTermsModalVisible(false)}
          title="Terms of Service"
          content={TERMS_OF_SERVICE}
          theme={theme}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
