import { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import Splash from './screens/Splash';
import Home from './screens/Home';
import Header from './components/Header'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SQLiteProvider } from 'expo-sqlite';
import { initDb } from './database';

export default function App() {
  const Stack = createNativeStackNavigator();
  
  const [appState, setAppState] = useState({
    isLoading: true,
    isOnboardingCompleted: false,
    avatarUri: null
  })

  const loadUserData = useCallback(async () => {
    try {
      const storedProfileData = await AsyncStorage.getItem("profileData")
      if(storedProfileData) {
        const userProfile = JSON.parse(storedProfileData)
        setAppState(prev=>({
          ...prev,
          isOnboardingCompleted: true,
          userProfile,
          isLoading:  false
        }))
      } else {
        setAppState((prev)=>({
          ...prev,
          isLoading: false
        }))
      }
    } catch (error) {
      console.error('Error loading user data', error);
      setAppState(prev => ({
        ...prev,
        isLoading: false
      }))
    }
  }, [])

  useEffect(()=>{
    loadUserData()
  },[loadUserData])

  if(appState.isLoading) {
    return <Splash />
  }

  return (
    <SQLiteProvider databaseName="little_lemon.db" onInit={initDb}>
      <NavigationContainer>  
        <Stack.Navigator initialRouteName={appState.isOnboardingCompleted ? "Home" : "Onboarding"}>
          <Stack.Screen 
            name="Home" 
            component={Home} 
            options={({ navigation }) => ({
              headerLeft: () => null,
              headerTitle: () => <Header navigation={navigation} />,
              headerStyle: { backgroundColor: "blue" },
            })}  
          />
          <Stack.Screen 
            name="Onboarding" 
            component={Onboarding}
            options={{
              headerShown: false, // This will hide the entire header
            }}
          />
          <Stack.Screen 
            name='Profile' 
            component={Profile} 
            options={({ navigation }) => ({
              headerLeft: () => null,
              headerTitle: () => <Header navigation={navigation} />,
              headerStyle: { backgroundColor: "blue" },
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
    
  );
}