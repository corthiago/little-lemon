import { StyleSheet, Text } from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import { isValidUSPhone } from "../utils/validation";

const InputPhone = ({value, label, onChangeText}) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <MaskedTextInput
      value={value}
      onChangeText={onChangeText}
      mask="(999) 999-9999"
      keyboardType="phone-pad"
      placeholder="(217) 555-0113"
      style={[
        styles.input,
        value && !isValidUSPhone(value) && { borderColor: "red" },
      ]}
   />
  </>
)

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

export default InputPhone;