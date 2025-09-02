import {useState, useEffect} from "react"
import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native"
import logo from "../assets/logo.png"
import { storage } from "../utils/storage";
import { getProfileNameInitials } from "../utils/utils";

const Header = ({ navigation }) => {
  const [profile, setProfile] = useState(null)

  useEffect(()=> {
    const profile  = async () => {
      const profile = await storage.getProfile();
      setProfile(profile)
    }

    profile();
  }, [])

  return (
    <View style={styles.headerContainer}>
      {
        navigation.canGoBack() ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.left}>
            <Text style={{ fontSize: 22 }}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.left} />
        )
      }
      <View style={styles.center}>
        <Image
          source={logo}
          style={styles.logo}
        />
      </View>

      <TouchableOpacity style={styles.right} onPress={() => navigation.navigate('Profile')} >
        {profile?.avatarUri ? (
          <Image source={{ uri: profile.avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{getProfileNameInitials()}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: { flex: 1, alignItems: "flex-start" },
  center: { flex: 3, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  right: { flex: 1, alignItems: "flex-end" },
  logo: {  height: 35, resizeMode: 'cover' },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  initialsCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#495E57',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bjold'
  }
})
export default Header;