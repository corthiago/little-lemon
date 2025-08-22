import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import Filters from "../components/Filters";
import {queryByCategories, queryByCategoriesAndSearch} from '../database';

const Home = () => {

  const sections = ["Starters", "Mains", "Desserts", "Drinks"]

  const db = useSQLiteContext();
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSelections, setFilterSelections] = useState(
    sections.map(() => false)
  );
  const [search, setSearch] = useState('');

  // Initialize table and load data
  useEffect(() => {
    const initDb = async () => {
      try {
        // Create table if it doesn't exist
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS menu (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            price TEXT,
            image TEXT,
            category TEXT
          );
        `);

        // Check if we have data in the database
        const result = await db.getAllAsync("SELECT * FROM menu");
        console.log('result', result)
        
        if (result.length > 0) {
          // Data exists in database, use it
          console.log('Loading data from database');
          setMenuData(result);
          setLoading(false);
        } else {
          // No data in database, fetch from API
          console.log('No data in database, fetching from API');
          await fetchMenuData();
        }
      } catch (err) {
        console.error("DB Init Error:", err);
        await fetchMenuData();
      }
    };

    initDb();
  }, []);

  const fetchMenuData = async () => {
    try {
      console.log('Fetching data from API');
      const response = await fetch(
        "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
      );
      const json = await response.json();
      const items = json.menu;
      
      // Update state with API data
      setMenuData(items);

      try {
        // Store in database
        await db.runAsync("DELETE FROM menu");
        
        for (const item of items) {
          await db.runAsync(
            "INSERT INTO menu (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)",
            [item.name, item.description, item.price, item.image, item.category]
          );
        }
        console.log('Data stored in database successfully');
      } catch (dbError) {
        console.error("Database storage error:", dbError);
      }
    } catch (err) {
      console.error("API fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = async (index) => {
      const arrayCopy = [...filterSelections];
      arrayCopy[index] = !filterSelections[index];
      setFilterSelections(arrayCopy);
      
      // Get active categories
      const activeCategories = sections.filter((_, idx) => arrayCopy[idx]);
      await updateMenuItems(activeCategories, search);
  };

  // Add this new function to handle menu updates
  const updateMenuItems = async (activeCategories, searchText) => {
    try {
        if (activeCategories.length > 0 || searchText) {
            const result = await queryByCategoriesAndSearch(db, activeCategories, searchText);
            setMenuData(result);
        } else {
            // If no filters and no search, show all items
            const result = await db.getAllAsync("SELECT * FROM menu");
            setMenuData(result);
        }
    } catch (error) {
        console.error("Error updating menu items:", error);
    }
  };

    // Update the handleSearchChange function
    const handleSearchChange = (text) => {
        setSearch(text);
        debouncedSearch(text);
    };

    // Update the lookup callback
    const lookup = useCallback(async (searchText) => {
        setSearch(searchText);
        const activeCategories = sections.filter((_, idx) => filterSelections[idx]);
        await updateMenuItems(activeCategories, searchText);
    }, [filterSelections, sections]);

    // Update the debounced function
    const debouncedSearch = useMemo(() => debounce(lookup, 500), [lookup]);


  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }


  const renderItem = ({ item }) => (
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
          uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
        }}
        style={styles.itemImage}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#495E57" />
        <Text>Loading menu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Little Lemon</Text>
        <Text style={styles.subtitle}>Chicago</Text>
        <Text style={styles.headerDesc}>
          We are a family owned Mediterranean restaurant, focused on traditional
          recipes served with a modern twist.
        </Text>
        <TextInput 
          style={styles.input}
          value={search}
          onChangeText={handleSearchChange}
          placeholder="Search"
          placeholderTextColor={'white'}
        />
      </View>

      {/* Menu Section */}
      <Text style={styles.sectionTitle}>ORDER FOR DELIVERY!</Text>
      {/* <View style={styles.tabs}>
        {["Starters", "Mains", "Desserts", "Drinks"].map((tab) => (
          <TouchableOpacity key={tab} style={styles.tabButton}>
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View> */}

      <Filters
        selections={filterSelections}
        onChange={handleFiltersChange}
        sections={sections}
      />

      <FlatList
        data={menuData}
        renderItem={renderItem}
        keyExtractor={(item) => item.image}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    backgroundColor: "#495E57",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F4CE14",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "white",
    marginBottom: 8,
  },
  headerDesc: {
    fontSize: 14,
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    color: 'white',
    fontStyle: 'italic'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 12,
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
  separator: {
    height: 1,
    backgroundColor: "#EDEFEE",
  },
});

export default Home;
