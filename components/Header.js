import {useState, useEffect} from "react"
import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native"
import logo from "../assets/logo.png"
import AsyncStorage from "@react-native-async-storage/async-storage"

const Header = ({navigation}) => {
  const [avatarUri, setAvatarUri] = useState(null)

  useEffect(()=>{
    (async () => {
      const user = await AsyncStorage.getItem("profileData")
      if(user){
        const parsed = JSON.parse(user)
        setAvatarUri(parsed.avatarUri)
      }
    })()
  },[])

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

      <TouchableOpacity style={styles.right} onPress={()=>navigation.navigate("Profile")}>
        <Image
          source={{ uri: avatarUri }}
          style={styles.avatar}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
})
export default Header;