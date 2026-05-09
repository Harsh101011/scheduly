import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

import ExpertListScreen from '../screens/ExpertListScreen';
import ExpertDetailScreen from '../screens/ExpertDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';

const Tab = createBottomTabNavigator();
const ExpertsStack = createStackNavigator();

function ExpertsStackNavigator() {
  return (
    <ExpertsStack.Navigator screenOptions={{ headerShown: false }}>
      <ExpertsStack.Screen name="ExpertList" component={ExpertListScreen} />
      <ExpertsStack.Screen name="ExpertDetail" component={ExpertDetailScreen} />
      <ExpertsStack.Screen name="Booking" component={BookingScreen} />
    </ExpertsStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.primaryLight,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Experts') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'MyBookings') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            }
            return (
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <Ionicons name={iconName} size={22} color={color} />
              </View>
            );
          },
        })}
      >
        <Tab.Screen
          name="Experts"
          component={ExpertsStackNavigator}
          options={{ tabBarLabel: 'Experts' }}
        />
        <Tab.Screen
          name="MyBookings"
          component={MyBookingsScreen}
          options={{ tabBarLabel: 'My Bookings' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.cardBorder,
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 10,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  iconContainer: {
    width: 40,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: colors.primaryGlow,
  },
});
