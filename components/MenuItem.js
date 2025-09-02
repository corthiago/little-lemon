import {View, Text, Image, StyleSheet} from 'react-native'

const IMAGE_BASE_URI = 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/'

export const MenuItem = ({ item }) => (
  <View style={styles.item}>
    <View style={{ flex: 1 }}>
      <Text style={styles.itemTitle}>{item.name}</Text>
      <Text style={styles.itemDesc} numberOfLines={2}>
        {item.description}
      </Text>
      <Text style={styles.itemPrice}>{item.price}</Text>
    </View>
    <Image
      source={{
        uri: `${IMAGE_BASE_URI}${item.image}?raw=true`,
      }}
      style={styles.itemImage}
    />
  </View>
);

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  itemDesc: {
    fontSize: 14,
    color: "#495E57",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  itemImage: {
    width: 70,
    height: 70,
    marginLeft: 10,
    borderRadius: 8,
  },
})