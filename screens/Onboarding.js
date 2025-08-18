import { useState } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, Image, Pressable } from 'react-native'
import logo from '../assets/little-lemon-logo-grey.png'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Onboarding = ({navigation}) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

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
      const userData = {
        firstName,
        email,
        isOnboarded: true
      };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      navigation.navigate('Profile')
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
    <View style={styles.container}>
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
          style={styles.button}
          title='next'
          onPress={handlePress}
          disabled={isButtonDisabled()}
        >
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
    padding: 10,
    color: '#edefee',
  },
  inputText: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f4ce14',
    width: 300,
    fontSize: 30,
    color: '#333333',
    marginBottom: 10
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
  }
})

export default Onboarding;