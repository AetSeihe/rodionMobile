import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {observer} from 'mobx-react';
import React from 'react';
import Header from '../sceleton/Header';
import AskGeo from '../screens/AskGeo/AskGeo';
import InfoGeo from '../screens/AskGeo/InfoGeo';
import Authorization from '../screens/Authorization/Authorization';
import Onboarding from '../screens/Onboarding/Onboarding';
import OnboardingFinishScreen from '../screens/Onboarding/OnboardingFinishScreen';
import {applicationStore} from '../store/applicationStore';
import {SCREEN_NAMES} from '../types/screen-names.type';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={applicationStore.initialScreenName}
        screenOptions={{
          header: () => <Header />,
          headerShadowVisible: false,
        }}>
        <Stack.Group
          screenOptions={{
            headerShown: false,
            animation: 'none',
          }}>
          <Stack.Screen name={SCREEN_NAMES.ONBOARDING} component={Onboarding} />
          <Stack.Screen
            name={SCREEN_NAMES.AUTHORIZATION}
            component={Authorization}
          />
          <Stack.Screen name={SCREEN_NAMES.INFO_GEO} component={InfoGeo} />
          <Stack.Screen name={SCREEN_NAMES.ASK_GEO} component={AskGeo} />
          <Stack.Screen
            name={SCREEN_NAMES.FINISH_ONBOARDING}
            component={OnboardingFinishScreen}
          />
        </Stack.Group>
        <Stack.Screen
          name={SCREEN_NAMES.MAIN}
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default observer(MainNavigator);
