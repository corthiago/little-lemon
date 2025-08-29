import * as ImagePicker from "expo-image-picker";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import { storage } from "../utils/storage";
import { useState } from "react";
import {getProfileNameInitials} from '../utils/utils'
export default Avatar = ({uri, onChangeImage, onRemoveImage}) => {
  const pickImage = async () => {
    const {granted} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      alert('Permission to access library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if  (!result.canceled){
      onChangeImage(result.assets[0].uri);
    }
  }

  const getInitials = async () => {
    const {firstName, lastName} = await storage.getProfile()
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`
  }

  return (
    <View style={styles.avatarRow}>
      {uri ? (
        <Image source={{ uri }} style={styles.avatar} />
      ) : (
        <View style={styles.initialsCircle}>
          <Text style={styles.initialsText}>{getProfileNameInitials()}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
        <Text style={styles.changeButtonText}>Change</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.removeButton} onPress={onRemoveImage}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
  initialsCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#495E57',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  initialsText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bjold'
  }
});