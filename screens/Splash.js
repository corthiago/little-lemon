import { View, Text, Image, StyleSheet } from "react-native"
import logo  from "../assets/little-lemon-logo.png"

const Splash = () => {
    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.image}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#edefee'},
    image: {
        resizeMode: 'contain',
        height: 460,
        padding: 50
    }
})

export default Splash;