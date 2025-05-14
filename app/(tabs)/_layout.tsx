import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ }) => ({
        headerShown: false,
        // headerTitle: 'WorkerBridge',
        //headerTitleStyle: layoutStyles.headerTitle,
        //headerBackgroundContainerStyle: isModeTab ? layoutStyles.modeTabHeaderContainer : layoutStyles.headerContainer,
        // headerRight: () => <SettingButton />,r
        //tabBarLabelStyle: layoutStyles.tabBarLabel,
        //tabBarIconStyle: layoutStyles.tabBarIcon,
        //tabBarActiveTintColor: '#fff',
        //tabBarInactiveTintColor: '#63636E',
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: 'Calculator',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calculator" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="onboarding"
        options={{
          title: 'Checklist',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'Chatbot',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
  },
  header: {
    display: 'none'
  }
})