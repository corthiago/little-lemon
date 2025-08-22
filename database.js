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

        // Add category filter if categories are selected
        if (activeCategories.length > 0) {
            query += ` AND LOWER(category) IN (${activeCategories.map(() => '?').join(', ')})`;
            params = [...params, ...lowerCaseCategories];
        }

        // Add search term filter if search is provided
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