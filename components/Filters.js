import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Filters = ({ onChange, selections, sections }) => {
  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            onChange(index);
          }}
          style={[styles.tabButton, {backgroundColor: selections[index] ? '#495E57' : '#EDEFEE'}]}
          >
          <View>
            <Text style={[styles.tabText, { color: selections[index] ? '#EDEFEE' : '#495E57' }]}>
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tabButton: {
    backgroundColor: "#EDEFEE",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  tabText: {
    fontSize: 14,
    color: "#495E57",
    fontWeight: "600",
  },
});

export default Filters;
