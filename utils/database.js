export const initDb = async (db) => {
  try {
    await db.execAsync(`
      DROP TABLE IF EXISTS menu;

      CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        price TEXT,
        image TEXT,
        category TEXT
      );
    `);
  } catch (err) {
    console.error("DB Init Error:", err);
  }
};

export const queryMenu = async (db) => {
  try {
    const menu = await db.getAllAsync("SELECT * FROM MENU;");
    return menu;
  } catch (error) {
    console.error('Database storage error', error);
  }
}

export const queryByCategories = async (db, activeCategories) => {
    try {
        const lowerCaseCategories = activeCategories.map((cat)=>cat.toLowerCase())
        console.log(lowerCaseCategories)
        const result = await db.getAllAsync(`SELECT * FROM menu WHERE category IN (${activeCategories.map(()=>'?').join(', ')})`, [...lowerCaseCategories]);
        return result
    } catch (error) {
        console.error("Database storage error", error);
        return []
    }
}

export const getUniqueCategories = async (db) => {
  try {
    const categories = await db.getAllAsync("SELECT DISTINCT category FROM menu ORDER BY category");
    return categories.map(c => c.category)
  } catch (error) {
    console.error("Database storage error:", error)
    return []
  }
}

export const insertMenu = async (db, menu) => {
  try {
    for (const item of menu) {
      await db.runAsync(
        "INSERT INTO menu (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)",
        [item.name, item.description, item.price, item.image, item.category]
      );
    }
    console.log('Data stored in database successfully');
  } catch (dbError) {
    console.error("Database storage error:", dbError);
  }
}

export const queryByCategoriesAndSearch = async (db, activeCategories, searchTerm) => {
  try {
    const lowerCaseCategories = activeCategories.map(cat => cat.toLowerCase());
    
    let query = 'SELECT * FROM menu WHERE 1=1';
    let params = [];

    if (activeCategories.length > 0) {
        query += ` AND LOWER(category) IN (${activeCategories.map(() => '?').join(', ')})`;
        params = [...params, ...lowerCaseCategories];
    }

    if (searchTerm) {
        query += ' AND LOWER(name) LIKE ?';
        params.push(`%${searchTerm.toLowerCase()}%`);
    }

    console.log('Executing query:', query, 'with params:', params);
    const result = await db.getAllAsync(query, params);
    return result;
  } catch (error) {
    console.error("Database storage error:", error);
    return [];
  }
}

export const deleteMenu = async (db) => {
  try {
    await db.runAsync("DELETE FROM menu") 
  } catch (error) {
    console.error('Database storage error:', error)
  }
}