import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import CabsListScreen from './screens/CabsListScreen';
import CabDetailScreen from './screens/CabDetailScreen';
import MyCabScreen from './screens/MyCabScreen';
import { CabProvider } from './context/CabContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CabsList" component={CabsListScreen} />
      <Stack.Screen name="CabDetail" component={CabDetailScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <CabProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'My Cab') {
                iconName = 'car-rental';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeStack} options={{headerShown: false}}/>
          <Tab.Screen name="My Cab" component={MyCabScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </CabProvider>
  );
}
