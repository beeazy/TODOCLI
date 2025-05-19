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
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
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
            {tabs.length > 1 && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
              >
                <Text style={[styles.closeButtonText, { color: theme.error }]}>×</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.addTabButton, { borderColor: theme.border }]}
          onPress={onAddTab}
        >
          <Text style={[styles.addTabButtonText, { color: theme.accent }]}>+</Text>
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
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tabText: {
    fontFamily: 'monospace',
    fontSize: 14,
  },
  closeButton: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  closeButtonText: {
    fontSize: 14,
    lineHeight: 14,
    marginTop: -1,
  },
  addTabButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTabButtonText: {
    fontSize: 20,
    lineHeight: 22,
    marginTop: -2,
  },
}); 