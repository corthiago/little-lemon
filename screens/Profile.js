import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {MaskedTextInput} from 'react-native-mask-text';
import * as ImagePicker from "expo-image-picker";

export default function Profile({navigation}) {
  const [avatarUri, setAvatarUri] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [orderStatuses, setOrderStatuses] = useState(true);
  const [passwordChanges, setPasswordChanges] = useState(true);
  const [specialOffers, setSpecialOffers] = useState(true);
  const [newsletter, setNewsletter] = useState(true);

  const isValidUSPhone = (value) => {
    const digits = value.replace(/\D/g, "");
    return /^\d{10}$/.test(digits);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    // Launch picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // square crop
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const getInitials = () => {
    const firstInitial = firstName?.charAt(0).toUpperCase() || "";
    const lastInitial = lastName?.charAt(0).toUpperCase() || "";
    return `${firstInitial}${lastInitial}`;
  };

  // Save all data
  const saveChanges = async () => {
    const profileData = {
      avatarUri,
      firstName,
      lastName,
      email,
      phone,
      orderStatuses,
      passwordChanges,
      specialOffers,
      newsletter,
    };

    try {
      await AsyncStorage.setItem("profileData", JSON.stringify(profileData));
      console.log(JSON.stringify(profileData))
      // alert("Changes saved successfully!");
      navigation.navigate('Home');
    } catch (err) {
      console.log("Error saving data:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // Remove all saved data
      navigation.reset({
        index: 0,
        routes: [{ name: "Onboarding" }], // Go to Onboarding and clear history
      });
    } catch (err) {
      console.log("Error clearing data:", err);
    }
  };

  useEffect(()=>{
    (async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('userData')
        if (jsonValue != null) {
          const userData = JSON.parse(jsonValue);
          setFirstName(userData.firstName)
          setEmail(userData.email)
        }
      } catch(error) {
        console.error('Error reading user data:', error)
      }
    })()
  })

  useEffect(() => {
    (async () => {
      try {
        const storedData = await AsyncStorage.getItem("profileData");
        if (storedData) {
          const parsed = JSON.parse(storedData);
          setAvatarUri(parsed.avatarUri || null);
          setFirstName(parsed.firstName || "");
          setLastName(parsed.lastName || "");
          setEmail(parsed.email || "");
          setPhone(parsed.phone || "");
          setOrderStatuses(parsed.orderStatuses ?? true);
          setPasswordChanges(parsed.passwordChanges ?? true);
          setSpecialOffers(parsed.specialOffers ?? true);
          setNewsletter(parsed.newsletter ?? true);
        }
      } catch (err) {
        console.log("Error loading data:", err);
      }
    })();
  }, []);

  return (
    <ScrollView style={styles.container}>

      {/* Section title */}
      <Text style={styles.sectionTitle}>Personal information</Text>

      <View style={styles.avatarRow}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{getInitials()}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
          <Text style={styles.changeButtonText}>Change</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => setAvatarUri(null)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First name"
      />
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last name"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />

      <MaskedTextInput
        value={phone}
        onChangeText={(masked, unmasked) => {
          setPhone(masked); // masked = (217) 555-0113
        }}
        mask="(999) 999-9999"
        keyboardType="phone-pad"
        placeholder="(217) 555-0113"
        style={[
          styles.input2,
          phone && !isValidUSPhone(phone) && { borderColor: "red" },
        ]}
      />

      {/* Email Notifications */}
      <Text style={styles.subTitle}>Email notifications</Text>
      <View style={styles.checkboxRow}>
        <Checkbox value={orderStatuses} onValueChange={setOrderStatuses} />
        <Text>Order statuses</Text>
      </View>
      <View style={styles.checkboxRow}>
        <Checkbox value={passwordChanges} onValueChange={setPasswordChanges} />
        <Text>Password changes</Text>
      </View>
      <View style={styles.checkboxRow}>
        <Checkbox value={specialOffers} onValueChange={setSpecialOffers} />
        <Text>Special offers</Text>
      </View>
      <View style={styles.checkboxRow}>
        <Checkbox value={newsletter} onValueChange={setNewsletter} />
        <Text>Newsletter</Text>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log out</Text>
      </TouchableOpacity>

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.discardButton}>
          <Text style={styles.discardText}>Discard changes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
          <Text style={styles.saveText}>Save changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: { padding: 5 },
  backArrow: { fontSize: 24 },
  logo: { width: 40, height: 40, resizeMode: "contain" },
  profileIcon: { width: 40, height: 40, borderRadius: 20 },
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
  input2: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
});
