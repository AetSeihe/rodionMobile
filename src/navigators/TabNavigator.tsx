import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { TABBAR_HEIGHT } from '../constants/app';
import HomeScreen from '../screens/MainScreen/HomeScreen';
import { colorTheme } from '../theme/theme';
import { SCREEN_NAMES } from '../types/screen-names.type';

const Tab = createBottomTabNavigator();
const screenIcons = {
  map: {
    active: require('./icons/map-icon.active.png'),
  },
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colorTheme.main,
        },
      }}>
      <Tab.Screen
        name={SCREEN_NAMES.MAP}
        component={HomeScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: () => (
            <Image
              style={styles.icon}
              source={screenIcons.map.active}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 31,
    height: 31,
  },
});

export default TabNavigator;
