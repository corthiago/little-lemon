export const initDb = async (db) => {
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS menu (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          description TEXT,
          price TEXT,
          image TEXT
        );
      `);

      const result = await db.getAllAsync("SELECT * FROM menu");
      
      if (result.length > 0) {
        console.log('Clearing database table...');
        await db.runAsync("DELETE FROM menu");
      } 
    } catch (err) {
      console.error("DB Init Error:", err);
    }
  };

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