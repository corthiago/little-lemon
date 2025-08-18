import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import Splash from './screens/Splash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from './assets/logo.png'

export default function App() {
  const Stack = createNativeStackNavigator();
  
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  function CustomHeader({ navigation }) {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.left}>
          <Text style={{ fontSize: 18 }}>←</Text>
        </TouchableOpacity>

        <View style={styles.center}>
          <Image
            source={logo}
            style={styles.logo}
          />
        </View>

        <TouchableOpacity style={styles.right}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
    );
  }
 

  useEffect(() => {
    (async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('userData')
        if (jsonValue != null) {
          setIsOnboardingCompleted(true)
        }
        setIsLoading(false)
        console.log(JSON.parse(jsonValue))
      } catch(error) {
        console.error('Error reading user data:', error)
        setIsLoading(false)
      }
    })()

  },[])

  if(isLoading) {
    return <Splash />
  } else if (!isOnboardingCompleted) {
    return <Onboarding />
  }

  return (
    <NavigationContainer>  
      <Stack.Navigator>
        <Stack.Screen 
          name='Profile' 
          component={Profile} 
          options={({ navigation }) => ({
            headerTitle: () => <CustomHeader navigation={navigation} />,
          headerStyle: { backgroundColor: "#fff" },
          })}
        />
        <Stack.Screen name="Onboarding" component={Onboarding} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
   headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  left: { flex: 1, alignItems: "flex-start" },
  center: { flex: 3, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  right: { flex: 1, alignItems: "flex-end" },
  logo: {  height: 35, resizeMode: 'cover' },
  title: { fontWeight: "bold", fontSize: 16 },
  avatar: { width: 32, height: 32, borderRadius: 16 },
});
