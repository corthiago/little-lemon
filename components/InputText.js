import { StyleSheet, TextInput, Text } from "react-native";

const InputText = ({label, value, onChangeText, placeholder, ...props}) => {
    return (
        <>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                {...props}
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
            />
        </>
        
    )
}

const styles = StyleSheet.create({
    label: {
        fontWeight: '700',
        fontSize: 12,
        paddingBottom: 4
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },
})
export default InputText;