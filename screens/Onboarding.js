import { useState } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, Image, Pressable, KeyboardAvoidingView, Platform } from 'react-native'
import logo from '../assets/little-lemon-logo-grey.png'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Onboarding = () => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  const navigation = useNavigation();

  const handlePress = async () => {
    if(!validadeName(firstName)){
      Alert.alert('First name must contain only letters.')
      return
    }
    if(!validadeEmail(email)){
      Alert.alert('Email must be valid.')
      return
    }

    try {
      const profileData = {
        firstName,
        email,
        isOnboardingCompleted: true
      };

      await AsyncStorage.setItem('profileData', JSON.stringify(profileData));
      
      navigation.navigate("Home")
      
    } catch (error) {
      Alert.alert('Error', 'Could not save your information');
      console.error(error);
    }
  }

  const isButtonDisabled = () => {
    if(!firstName || !email) return true
    return false
  }

  const validadeEmail = (email) => {
    return email.match(/.+@.+\./);
  }

  const validadeName = (name) =>{
    return name.match(/^[A-Za-z\s]+$/)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Little Lemon</Text>
          <Image source={logo} resizeMode='contain' style={styles.logo}/>
        </View>
        <View style={[styles.section]}>
          <Text style={styles.headingText}>Let us get to know you</Text>
          <Text style={styles.inputTitle}>First Name</Text>
          <TextInput
            style={styles.inputText}
            onChangeText={setFirstName}
            value={firstName}
          />
          <Text style={styles.inputTitle}>Email</Text>
          <TextInput
            style={styles.inputText}
            onChangeText={setEmail}
            value={email}
            keyboardType='email-address'
            autoCapitalize='none'
          />
        </View>
        <View style={styles.footer}>
          <Pressable
            style={[styles.button, isButtonDisabled() && styles.buttonDisabled]}
            title='next'
            onPress={handlePress}
            disabled={isButtonDisabled()}
          >
            <Text style={styles.buttonText}>Next</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#edefee'
  },
  container: {
    flex: 1
  },
  header:{
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#edefee'
  },
  headerText: {
    fontSize: 26,
    color: '#495e57',
    fontWeight: 'bold'
  },
  logo: {
    width: 50,
    height: 50,
    marginLeft: 10
  },
  section: {
    flex:3,
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#495e57',
  },
  headingText: {
    paddingBottom: 100,
    fontSize: 26,
    color: '#f4ce14',
  },
  inputTitle: {
    fontSize: 22,
    padding: 6,
    color: '#edefee',
  },
  inputText: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f4ce14',
    width: 300,
    fontSize: 18,
    color: '#FFF',
    marginBottom: 10,
    padding: 6
  },
  footer: {
    flex:1 ,
    alignItems: 'center',
    backgroundColor: '#edefee'
  },
  button: {
    padding: 12,
    alignItems: 'center',
    border: 5,
    borderRadius: 20,
    backgroundColor: '#495e57',
    marginTop: 60,
    marginLeft: 220
  },
  buttonText: {
    fontSize: 22,
    color: '#edefee',
    fontWeight: 'bold',
    paddingHorizontal: 14
  },
  buttonDisabled: {
    opacity: 0.5
  }
})

export default Onboarding;