const db = require('../db/db');

// const getCategories = (req, res) => {
//   db.query('SELECT * FROM categories', (err, results) => {
//     if (err) {
//       console.error('Error fetching categories:', err);
//       return res.status(500).json({ message: 'Internal server error' });
//     }

//     res.json(results);
//   });
// };
const getCategories = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// const getUserCategories = (req, res) => {
//   const userId = req.user.id;
//   const sql = `
//     SELECT c.id, c.name
//     FROM user_categories uc
//     JOIN categories c ON uc.category_id = c.id
//     WHERE uc.user_id = ?
//   `;

//   db.query(sql, [userId], (err, results) => {
//     if (err) {
//       console.error('Error fetching user categories:', err);
//       return res.status(500).json({ message: 'Internal server error' });
//     }
//     res.json(results);
//   });
// };

const getUserCategories = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user.id;

    const sql = `
      SELECT c.id, c.name
      FROM user_categories uc
      JOIN categories c ON uc.category_id = c.id
      WHERE uc.user_id = $1
    `;

    const result = await db.query(sql, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching user categories:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add categories for a user
// const addUserCategories = (req, res) => {
//   const userId = req.user.id;
//   const { categoryIds } = req.body;

//   if (!userId || !Array.isArray(categoryIds)) {
//     return res.status(400).json({ message: 'Invalid input' });
//   }

//   const values = categoryIds.map((categoryId) => [userId, categoryId]);
//   const sql =
//     'INSERT IGNORE INTO user_categories (user_id, category_id) VALUES ?';

//   db.query(sql, [values], (err, results) => {
//     if (err) {
//       console.error('Error adding user categories:', err);
//       return res.status(500).json({ message: 'Internal server error' });
//     }
//     res.status(201).json({ message: 'Categories added successfully' });
//   });
// };

const addUserCategories = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { categoryIds } = req.body;

    if (!userId || !Array.isArray(categoryIds)) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    const sql = `
      INSERT INTO user_categories (user_id, category_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, category_id) DO NOTHING
    `;

    for (const categoryId of categoryIds) {
      await db.query(sql, [userId, categoryId]);
    }

    res.status(201).json({ message: 'Categories added successfully' });
  } catch (err) {
    console.error('Error adding user categories:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// const getMaterials = (req, res) => {
//   const { categories } = req.query;

//   // console.log('🛠️ getMaterials controller called');
//   // console.log('📥 Received categories query:', categories);

//   let sql = `
//     SELECT m.*, c.name as category_name
//     FROM materials m
//     JOIN categories c ON m.category_id = c.id
//   `;

//   let params = [];

//   if (categories) {
//     const ids = categories
//       .split(',')
//       .map((id) => parseInt(id))
//       .filter((id) => !isNaN(id));

//     // console.log('🔍 Parsed category IDs:', ids);

//     if (ids.length > 0) {
//       const placeholders = ids.map(() => '?').join(',');
//       sql += ` WHERE m.category_id IN (${placeholders})`;
//       params = ids;
//     }
//   }
//   // else {
//   //   console.log('📂 No categories specified, returning all');
//   // }

//   // console.log('🧾 Final SQL:', sql);
//   // console.log('📌 Params:', params);

//   db.query(sql, params, (err, results) => {
//     if (err) {
//       console.error('❌ DB query error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }

//     // console.log(`✅ Returning ${results.length} materials`);
//     res.json(results);
//   });
// };
const getMaterials = async (req, res) => {
  try {
    const { categories } = req.query;

    let sql = `
      SELECT m.*, c.name AS category_name
      FROM materials m
      JOIN categories c ON m.category_id = c.id
    `;

    let params = [];

    if (categories) {
      const ids = categories
        .split(',')
        .map(Number)
        .filter((id) => !isNaN(id));

      if (ids.length > 0) {
        const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
        sql += ` WHERE m.category_id IN (${placeholders})`;
        params = ids;
      }
    }

    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error' });
  }
};

// const deleteUserCategory = (req, res) => {
//   const userId = req.user.id;
//   const categoryId = parseInt(req.params.categoryId);

//   if (!userId || !categoryId) {
//     return res.status(400).json({ message: 'Invalid request' });
//   }

//   const sql =
//     'DELETE FROM user_categories WHERE user_id = ? AND category_id = ?';

//   db.query(sql, [userId, categoryId], (err, results) => {
//     if (err) {
//       console.error('Error deleting user category:', err);
//       return res.status(500).json({ message: 'Internal server error' });
//     }
//     res.status(200).json({ message: 'Category removed successfully' });
//   });
// };
const deleteUserCategory = async (req, res) => {
  try {
    const userId = req.user?.id;
    const categoryId = Number(req.params.categoryId);

    if (!userId || !categoryId) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const sql = `
      DELETE FROM user_categories
      WHERE user_id = $1 AND category_id = $2
    `;

    await db.query(sql, [userId, categoryId]);

    res.status(200).json({ message: 'Category removed successfully' });
  } catch (err) {
    console.error('Error deleting user category:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getCategories,
  getUserCategories,
  addUserCategories,
  getMaterials,
  deleteUserCategory,
};
