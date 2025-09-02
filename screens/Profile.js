import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { storage } from "../utils/storage";
import Check from "../components/Check";
import Avatar from "../components/Avatar";
import InputText from "../components/InputText";
import InputPhone from "../components/InputPhone";

export default function Profile({navigation}) {
  const [profileData, setProfileData] = useState({
    avatarUri: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferences: {
      orderStatuses: false,
      passwordChanges: false,
      specialOffers: false,
      newsletter: false
    }
  });

  const updateField = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  }

  const updatePreferences = (key, value) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }))
  }

  const handleSave = async () => {
    try {
      await storage.saveProfile(profileData);
      navigation.navigate('Home');
    } catch (error) {
      alert('Failed to save changes', error);
      console.error(error)
    }
  };

  const handleDiscard = () => {
    updateField('lastName', '');
    updateField('phone', '')
    updatePreferences('orderStatuses', false)
    updatePreferences('passwordChanges', false)
    updatePreferences('specialOffers', false)
    updatePreferences('newsletter', false)
  }

  useEffect(()=>{
    const loadProfile = async () => {
      const profile = await storage.getProfile();
      if (profile) {
        setProfileData(profile)
      }
    }
    loadProfile()
  }, [])

  const handleLogout = async () => {
    try {
      await storage.clearAll();
      navigation.reset({
        index: 0,
        routes: [{ name: "Onboarding" }],
      });
    } catch(error) {
      alert('Failed to logout');
      console.error(error);
    }
  }

  const getInitials = () => {
    return `${profileData.firstName?.charAt(0) || ''}${profileData.lastName?.charAt(0) || ''}`
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Personal information</Text>

        <Avatar 
          uri={profileData.avatarUri}
          onChangeImage={(value) => updateField('avatarUri', value)}
          onRemoveImage={() => updateField('avatarUri', null)}
          initials={getInitials()}
        />

        <InputText
          value={profileData.firstName}
          onChangeText={(value) => updateField('firstName', value)}
          label="First name"
        />

        <InputText
          value={profileData.lastName}
          onChangeText={(value) => updateField('lastName', value)}
          label="Last name"
        />
        
        <InputText
          value={profileData.email}
          onChangeText={(value) => updateField('email', value)}
          label="Email"
          autoCapitalize="none"
        />

        <InputPhone
          value={profileData.phone}
          onChangeText={(masked, unmasked) => {
            updateField('phone', masked); // masked = (217) 555-0113
          }}
          label="Phone"
        />

        <Text style={styles.subTitle}>Email notifications</Text>
        <Check 
          value={profileData.preferences?.orderStatuses}
          onValueChange={(value) => updatePreferences('orderStatuses', value)}
          label='Order Statuses'
        />
        <Check 
          value={profileData.preferences?.passwordChanges}
          onValueChange={(value) => updatePreferences('passwordChanges', value)}
          label='Password Changes'
        />
        <Check 
          value={profileData.preferences?.specialOffers}
          onValueChange={(value) => updatePreferences('specialOffers', value)}
          label='Special Offers'
        />
        <Check 
          value={profileData.preferences?.newsletter}
          onValueChange={(value) => updatePreferences('newsletter', value)}
          label='Newsletter'
        />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>

        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.discardButton} onPress={handleDiscard}>
            <Text style={styles.discardText}>Discard changes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  avatarRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 10 },
  changeButton: {
    backgroundColor: "#4a5d4d",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    marginRight: 8,
  },
  changeButtonText: { color: "#fff" },
  removeButton: {
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  removeButtonText: { color: "#555" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  subTitle: { fontWeight: "bold", marginVertical: 12 },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  logoutButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
  },
  logoutButtonText: { fontWeight: "bold" },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  discardButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  discardText: { color: "#555" },
  saveButton: {
    backgroundColor: "#4a5d4d",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveText: { color: "#fff" },
});
