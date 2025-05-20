import { useTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { analytics } from "./services/analytics";
import { initializeAnalytics } from "./services/init";

export default function Layout() {
  const { colors: theme } = useTheme();

  useEffect(() => {
    initializeAnalytics();
    analytics.trackAppLaunch();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      />
    </View>
  );
}
