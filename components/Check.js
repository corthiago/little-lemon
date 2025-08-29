import Checkbox from "expo-checkbox";
import { View, Text, StyleSheet } from "react-native";

export default Check = ({value, onValueChange, label}) => (
	<View style={styles.container}>
		<Checkbox value={value} onValueChange={onValueChange} style={styles.checkbox}/>
		<Text style={styles.label}>{label}</Text>
	</View>
)

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		flexDirection: 'row',
		marginBottom: 8,
	},
	label: {
		paddingLeft: 6,
	}
})