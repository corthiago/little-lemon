import { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import Splash from './screens/Splash';
import Home from './screens/Home';
import Header from './components/Header'
import { SQLiteProvider } from 'expo-sqlite';
import { initDb } from './utils/database';
import { storage } from './utils/storage';

export default function App() {
  
  const [appState, setAppState] = useState({
    isLoading: true,
    isOnboardingCompleted: false,
    avatarUri: null
  })
  
  const loadUserData = useCallback(async () => {
    try {
      const profile = await storage.getProfile()
      if(profile) {
        setAppState(prev=>({
          ...prev,
          isOnboardingCompleted: true,
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
  
  const Stack = createNativeStackNavigator();
  
  return (
    <SQLiteProvider databaseName="little_lemon.db" onInit={initDb}>
      <NavigationContainer>  
        <Stack.Navigator 
          initialRouteName={appState.isOnboardingCompleted ? "Home" : "Onboarding"}
          screenOptions={{
            headerBackVisible: false
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={Home}
            options={({ navigation }) => ({
              headerTitle: () => <Header navigation={navigation} />,
            })}
          />
          <Stack.Screen 
            name="Onboarding" 
            component={Onboarding}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name='Profile' 
            component={Profile} 
            options={({ navigation }) => ({
              headerTitle: () => <Header navigation={navigation} />,
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
    
  );
}