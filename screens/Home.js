import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import Filters from "../components/Filters";
import {queryByCategoriesAndSearch, queryMenu, deleteMenu, insertMenu, getUniqueCategories} from '../utils/database';
import { fetchMenu } from '../utils/api';
import { MenuItem } from "../components/MenuItem";
import restaurant from '../assets/restaurant.png'

const Home = () => {

  const db = useSQLiteContext();
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([])
  
  const [filterSelections, setFilterSelections] = useState(
    sections.map(() => false)
  );
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await queryMenu(db);
        
        if (result.length > 0) {
          console.log('Loading data from database');
          setMenuData(result);
          setSections([...new Set(result.map(item => item.category))])
        } else {
          console.log('No data in database, fetching from API');
          const menu = await fetchMenu();
          setMenuData(menu);
          setSections([...new Set(result.map(item => item.category))])
          await insertMenu(db, menu);
        }
        const categories = await getUniqueCategories(db)
        setSections(categories) 
      } catch (err) {
        console.error("Data loading error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleFiltersChange = async (index) => {
      const arrayCopy = [...filterSelections];
      arrayCopy[index] = !filterSelections[index];
      setFilterSelections(arrayCopy);
      
      const activeCategories = sections.filter((_, idx) => arrayCopy[idx]);
      await updateMenuItems(activeCategories, search);
  };

  const updateMenuItems = async (activeCategories, searchText) => {
    if (activeCategories.length > 0 || searchText) {
        const result = await queryByCategoriesAndSearch(db, activeCategories, searchText);
        setMenuData(result);
    } else {
        const result = await queryMenu(db);
        setMenuData(result);
    }
  };

  const handleSearchChange = (text) => {
      setSearch(text);
      debouncedSearch(text);
  };

  const lookup = useCallback(async (searchText) => {
      setSearch(searchText);
      const activeCategories = sections.filter((_, idx) => filterSelections[idx]);
      await updateMenuItems(activeCategories, searchText);
  }, [filterSelections, sections]);

  const debouncedSearch = useMemo(() => debounce(lookup, 500), [lookup]);

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#495E57" />
        <Text>Loading menu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Little Lemon</Text>
            <Text style={styles.subtitle}>Chicago</Text>
            <Text style={styles.headerDesc}>
              We are a family owned Mediterranean restaurant, focused on traditional
              recipes served with a modern twist.
            </Text>
          </View>
          <View style={styles.imageContainer}>
            <Image 
              source={restaurant}
              style={styles.headerImage}
            />
          </View>
        </View>
        <TextInput 
          style={styles.input}
          value={search}
          onChangeText={handleSearchChange}
          placeholder="Search"
          placeholderTextColor={'white'}
        />
      </View>

      <Text style={styles.sectionTitle}>ORDER FOR DELIVERY!</Text>

      <Filters
        selections={filterSelections}
        onChange={handleFiltersChange}
        sections={sections}
      />

      <FlatList
        data={menuData}
        renderItem={({item}) => <MenuItem item={item} />}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    backgroundColor: "#495E57",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },
  headerContent: {
    flex: 2,
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    width: '100%',
    height: 140,
    resizeMode: 'contain',
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
    lineHeight: 20
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
  separator: {
    height: 1,
    backgroundColor: "#EDEFEE",
  },
});

export default Home;
