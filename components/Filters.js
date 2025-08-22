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
          // style={{
          //   flex: 1 / sections.length,
          //   justifyContent: 'center',
          //   alignItems: 'center',
          //   padding: 16,
          //   backgroundColor: selections[index] ? '#EE9972' : '#495E57',
          //   borderWidth: 1,
          //   borderColor: 'white',
          // }}
          style={[styles.tabButton, {backgroundColor: selections[index] ? '#495E57' : '#EDEFEE'}]}
          >
          <View>
            <Text style={[styles.tabText, { color: selections[index] ? '#EDEFEE' : '#495E57' }]}>
              {section}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    // backgroundColor: 'green',
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
