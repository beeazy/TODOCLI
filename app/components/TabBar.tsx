import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Theme } from '../types';

interface Tab {
  id: string;
  title: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
  onAddTab: () => void;
  onCloseTab: (tabId: string) => void;
  theme: Theme;
}

export default function TabBar({
  tabs,
  activeTab,
  onTabPress,
  onAddTab,
  onCloseTab,
  theme,
}: TabBarProps) {
  return (
    <View style={[styles.container, { borderBottomColor: theme.border }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => (
          <View key={tab.id} style={styles.tabWrapper}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === tab.id && { backgroundColor: theme.surface },
                { borderColor: theme.border }
              ]}
              onPress={() => onTabPress(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === tab.id ? theme.accent : theme.muted }
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
            {tabs.length > 1 && (
              <TouchableOpacity
                style={[styles.closeButton, { borderColor: theme.error }]}
                onPress={() => onCloseTab(tab.id)}
              >
                <Text style={[styles.closeButtonText, { color: theme.error }]}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity
          style={[styles.addButton, { borderColor: theme.accent }]}
          onPress={onAddTab}
        >
          <Text style={[styles.addButtonText, { color: theme.accent }]}>+</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    fontFamily: 'monospace',
    fontSize: 14,
  },
  closeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  closeButtonText: {
    fontSize: 16,
    lineHeight: 18,
    marginTop: -2,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 20,
    lineHeight: 22,
    marginTop: -2,
  },
}); 