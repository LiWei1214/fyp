const db = require('../db/db');

// Note CRUD
// exports.getNotes = (req, res) => {
//   const studentId = req.user.id;
//   const sql = 'SELECT * FROM notes WHERE student_id = ?';
//   db.query(sql, [studentId], (err, results) => {
//     if (err) return res.status(500).json({error: 'Database error'});
//     res.json(results);
//   });
// };
exports.getNotes = async (req, res) => {
  try {
    const studentId = req.user.id;

    const { rows } = await db.query(
      'SELECT * FROM notes WHERE student_id = $1 ORDER BY created_at DESC',
      [studentId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// exports.createNote = (req, res) => {
//   const {title, content} = req.body;
//   const student_id = req.user.id;

//   if (!title || !content) {
//     return res.status(400).json({error: 'Title and content are required'});
//   }

//   const sql = 'INSERT INTO notes (student_id, title, content) VALUES (?, ?, ?)';
//   db.query(sql, [student_id, title, content], (err, result) => {
//     if (err) return res.status(500).json({error: 'Database error'});

//     res.json({message: 'Note created successfully', noteId: result.insertId});
//   });
// };
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const studentId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const { rows } = await db.query(
      `
      INSERT INTO notes (student_id, title, content)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [studentId, title, content]
    );

    res.status(201).json({
      message: 'Note created successfully',
      noteId: rows[0].id,
    });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// exports.updateNote = (req, res) => {
//   const {id} = req.params;
//   const {title, content} = req.body;
//   const sql = 'UPDATE notes SET title = ?, content = ? WHERE id = ?';
//   db.query(sql, [title, content, id], (err, result) => {
//     if (err) return res.status(500).json({error: 'Database error'});
//     res.json({message: 'Note updated successfully'});
//   });
// };

exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const studentId = req.user.id;

    const result = await db.query(
      `
      UPDATE notes
      SET title = $1, content = $2
      WHERE id = $3 AND student_id = $4
      `,
      [title, content, id, studentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ message: 'Note updated successfully' });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// exports.deleteNote = (req, res) => {
//   const { id } = req.params;
//   const sql = 'DELETE FROM notes WHERE id = ?';
//   db.query(sql, [id], (err, result) => {
//     if (err) return res.status(500).json({ error: 'Database error' });
//     res.json({ message: 'Note deleted successfully' });
//   });
// };

exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    const result = await db.query(
      'DELETE FROM notes WHERE id = $1 AND student_id = $2',
      [id, studentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// To-Do List CRUD
// exports.getTodos = (req, res) => {
//   const studentId = req.user.id;
//   const sql = 'SELECT * FROM todos WHERE student_id = ?';
//   db.query(sql, [studentId], (err, results) => {
//     if (err) return res.status(500).json({ error: 'Database error' });
//     res.json(results);
//   });
// };
exports.getTodos = async (req, res) => {
  try {
    const studentId = req.user.id;

    const { rows } = await db.query(
      'SELECT * FROM todos WHERE student_id = $1',
      [studentId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// exports.getTodosWithType = (req, res) => {
//   const studentId = req.user.id;
//   const sql =
//     'SELECT id, title, is_completed, due_date FROM todos WHERE student_id = ?';
//   db.query(sql, [studentId], (err, results) => {
//     if (err) return res.status(500).json({ error: 'Database error' });

//     const todos = results.map((todo) => {
//       const dueDate = new Date(todo.due_date);
//       const dueYear = dueDate.getFullYear();
//       const dueMonth = dueDate.getMonth();
//       const dueDay = dueDate.getDate();

//       const todayDate = new Date();
//       const todayYear = todayDate.getFullYear();
//       const todayMonth = todayDate.getMonth();
//       const todayDay = todayDate.getDate();

//       const thisMonthYear = todayDate.getFullYear();
//       const thisMonthMonth = todayDate.getMonth();

//       let type = 'other';
//       if (
//         dueYear === todayYear &&
//         dueMonth === todayMonth &&
//         dueDay === todayDay
//       ) {
//         type = 'daily';
//       } else if (dueYear === thisMonthYear && dueMonth === thisMonthMonth) {
//         type = 'monthly';
//       }

//       return { ...todo, type };
//     });

//     res.json(todos);
//   });
// };
exports.getTodosWithType = async (req, res) => {
  try {
    const studentId = req.user.id;

    const { rows } = await db.query(
      'SELECT id, title, is_completed, due_date FROM todos WHERE student_id = $1',
      [studentId]
    );

    // Map todos and calculate type
    const todos = rows.map((todo) => {
      const dueDate = new Date(todo.due_date);
      const today = new Date();

      let type = 'other';
      if (
        dueDate.getFullYear() === today.getFullYear() &&
        dueDate.getMonth() === today.getMonth() &&
        dueDate.getDate() === today.getDate()
      ) {
        type = 'daily';
      } else if (
        dueDate.getFullYear() === today.getFullYear() &&
        dueDate.getMonth() === today.getMonth()
      ) {
        type = 'monthly';
      }

      return { ...todo, type };
    });

    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos with type:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// exports.createTodo = (req, res) => {
//   const { title, description, due_date, list_id } = req.body;
//   const studentId = req.user.id; // Assuming JWT is used to get student ID

//   if (!title) {
//     return res.status(400).json({ error: 'Task title is required' });
//   }

//   const sql =
//     'INSERT INTO todos (student_id, title, description, due_date, list_id) VALUES (?, ?, ?, ?, ?)';
//   db.query(
//     sql,
//     [studentId, title, description, due_date, list_id],
//     (err, result) => {
//       if (err) return res.status(500).json({ error: 'Database error' });
//       res
//         .status(201)
//         .json({ message: 'Task created successfully', id: result.insertId });
//     }
//   );
// };

exports.createTodo = async (req, res) => {
  try {
    const { title, description, due_date, list_id } = req.body;
    const studentId = req.user.id;

    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const { rows } = await db.query(
      `
      INSERT INTO todos (student_id, title, description, due_date, list_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [studentId, title, description, due_date, list_id]
    );

    res.status(201).json({
      message: 'Task created successfully',
      id: rows[0].id,
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// exports.updateTodo = (req, res) => {
//   const { id } = req.params;
//   const { title, description, due_date, is_completed } = req.body;

//   console.log('Updating todo with ID:', id);
//   console.log('Received data:', { title, description, due_date, is_completed });

//   const sql =
//     'UPDATE todos SET title = ?, description = ?, due_date = ?, is_completed = ? WHERE id = ?';
//   db.query(
//     sql,
//     [title, description, due_date, is_completed, id],
//     (err, result) => {
//       if (err) {
//         console.error('Database error during todo update:', err);
//         return res.status(500).json({ error: 'Database error' });
//       }
//       console.log('Update result:', result); // Log the result of the query
//       res.json({ message: 'Task updated successfully' });
//     }
//   );
// };

exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, is_completed } = req.body;

    const result = await db.query(
      `
      UPDATE todos
      SET title = $1,
          description = $2,
          due_date = $3,
          is_completed = $4
      WHERE id = $5 AND student_id = $6
      `,
      [title, description, due_date, is_completed, id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Delete a task
// exports.deleteTodo = (req, res) => {
//   const { id } = req.params;
//   const studentId = req.user.id;

//   const sql = 'DELETE FROM todos WHERE id = ? AND student_id = ?';
//   db.query(sql, [id, studentId], (err, result) => {
//     if (err) {
//       console.error('Database error deleting todo:', err);
//       return res.status(500).json({ error: 'Database error' });
//     }
//     if (result.affectedRows === 0) {
//       return res
//         .status(404)
//         .json({ error: 'Task not found or does not belong to the user' });
//     }
//     res.json({ message: 'Task deleted successfully', id });
//   });
// };

exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM todos WHERE id = $1 AND student_id = $2',
      [id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// exports.getLists = (req, res) => {
//   const studentId = req.user.id;

//   const sql = 'SELECT * FROM lists WHERE student_id = ?';
//   db.query(sql, [studentId], (err, results) => {
//     if (err) {
//       console.error('Database error fetching lists:', err);
//       return res.status(500).json({ error: 'Database error' });
//     }
//     res.json(results);
//   });
// };
exports.getLists = async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM lists WHERE student_id = $1',
      [req.user.id]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching lists:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Create a new list
// exports.createList = (req, res) => {
//   const { name } = req.body;
//   const studentId = req.user.id;

//   if (!name) {
//     return res.status(400).json({ error: 'List name is required' });
//   }

//   const sql = 'INSERT INTO lists (student_id, name) VALUES (?, ?)';
//   db.query(sql, [studentId, name], (err, result) => {
//     if (err) {
//       console.error('Database error creating list:', err);
//       return res.status(500).json({ error: 'Database error' });
//     }
//     res.status(201).json({
//       message: 'List created successfully',
//       id: result.insertId,
//       name,
//     });
//   });
// };

exports.createList = async (req, res) => {
  try {
    const { name } = req.body;

    const { rows } = await db.query(
      `
      INSERT INTO lists (student_id, name)
      VALUES ($1, $2)
      RETURNING id, name
      `,
      [req.user.id, name]
    );

    res.status(201).json({
      message: 'List created successfully',
      ...rows[0],
    });
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Update an existing list name
// exports.updateList = (req, res) => {
//   const { id } = req.params;
//   const { name } = req.body;
//   const studentId = req.user.id;

//   if (!name) {
//     return res.status(400).json({ error: 'New list name is required' });
//   }

//   const sql = 'UPDATE lists SET name = ? WHERE id = ? AND student_id = ?';
//   db.query(sql, [name, id, studentId], (err, result) => {
//     if (err) {
//       console.error('Database error updating list:', err);
//       return res.status(500).json({ error: 'Database error' });
//     }
//     if (result.affectedRows === 0) {
//       return res
//         .status(404)
//         .json({ error: 'List not found or does not belong to the user' });
//     }
//     res.json({ message: 'List updated successfully', id, name });
//   });
// };

exports.updateList = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const result = await db.query(
      `
      UPDATE lists
      SET name = $1
      WHERE id = $2 AND student_id = $3
      `,
      [name, id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'List not found' });
    }

    res.json({ message: 'List updated successfully' });
  } catch (error) {
    console.error('Error updating list:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Delete a list
// exports.deleteList = (req, res) => {
//   const { id } = req.params;
//   const studentId = req.user.id;

//   const sql = 'DELETE FROM lists WHERE id = ? AND student_id = ?';
//   db.query(sql, [id, studentId], (err, result) => {
//     if (err) {
//       console.error('Database error deleting list:', err);
//       return res.status(500).json({ error: 'Database error' });
//     }
//     if (result.affectedRows === 0) {
//       return res
//         .status(404)
//         .json({ error: 'List not found or does not belong to the user' });
//     }
//     res.json({ message: 'List deleted successfully', id });
//   });
// };
exports.deleteList = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM lists WHERE id = $1 AND student_id = $2',
      [id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'List not found' });
    }

    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    console.error('Error deleting list:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// exports.getAllMaterialsForStudents = (req, res) => {
//   db.query(
//     `
//       SELECT
//         m.id,
//         m.title,
//         m.description,
//         m.file_path,
//         m.isQuizEnabled,
//         c.name AS category_name
//       FROM materials m
//       JOIN categories c ON m.category_id = c.id
//       ORDER BY m.created_at DESC
//     `,
//     (error, results) => {
//       if (error) {
//         console.error('Error fetching materials for students:', error);
//         res
//           .status(500)
//           .json({ message: 'Failed to fetch materials', error: error.message });
//       } else {
//         res.status(200).json(results);
//       }
//     }
//   );
// };
exports.getAllMaterialsForStudents = async (req, res) => {
  try {
    const sql = `
      SELECT
        m.id,
        m.title,
        m.description,
        m.file_path,
        m.isQuizEnabled,
        c.name AS category_name
      FROM materials m
      JOIN categories c ON m.category_id = c.id
      ORDER BY m.created_at DESC
    `;

    const result = await db.query(sql);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching materials for students:', error);
    res.status(500).json({ message: 'Failed to fetch materials' });
  }
};

// exports.getStudentQuizByMaterialId = async (req, res) => {
//   const { materialId } = req.params;

//   try {
//     const [results] = await db.promise().query(
//       `
//       SELECT q.id AS quiz_id, qq.id AS question_id, qq.question_text, qq.options, qq.correct_answer
//       FROM quizzes q
//       JOIN quiz_questions qq ON q.id = qq.quiz_id
//       WHERE q.material_id = ?
//       `,
//       [materialId]
//     );

//     if (results.length === 0) {
//       return res
//         .status(404)
//         .json({ message: 'No quiz found for this material.' });
//     }

//     res.status(200).json(results);
//   } catch (error) {
//     console.error('Error fetching quiz by material ID:', error);
//     res.status(500).json({ message: 'Failed to fetch quiz.', error });
//   }
// };
exports.getStudentQuizByMaterialId = async (req, res) => {
  const { materialId } = req.params;

  try {
    const sql = `
      SELECT
        q.id AS quiz_id,
        qq.id AS question_id,
        qq.question_text,
        qq.options,
        qq.correct_answer
      FROM quizzes q
      JOIN quiz_questions qq ON q.id = qq.quiz_id
      WHERE q.material_id = $1
    `;

    const result = await db.query(sql, [materialId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'No quiz found for this material.' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching quiz by material ID:', error);
    res.status(500).json({ message: 'Failed to fetch quiz.' });
  }
};

// exports.getQuizByCategoryForStudent = (req, res) => {
//   const materialId = req.params.materialId;

//   const quizQuery = `
//     SELECT qq.id, qq.question_text, qq.options, qq.correct_answer
//     FROM quiz_questions qq
//     JOIN quizzes q ON qq.quiz_id = q.id
//     JOIN materials m ON m.category_id = q.category_id
//     WHERE m.id = ?
//   `;

//   db.query(quizQuery, [materialId], (error, results) => {
//     if (error) {
//       console.error('Error fetching quiz for student:', error);
//       return res.status(500).json({ message: 'Failed to fetch quiz', error });
//     }

//     if (results.length === 0) {
//       return res
//         .status(404)
//         .json({ message: 'No quiz available for this material.' });
//     }

//     const formatted = results.map((row) => ({
//       id: row.id,
//       question_text: row.question_text,
//       options: JSON.parse(row.options),
//       correct_answer: row.correct_answer,
//     }));

//     res.status(200).json(formatted);
//   });
// };
exports.getQuizByCategoryForStudent = async (req, res) => {
  const { materialId } = req.params;

  try {
    const sql = `
      SELECT
        qq.id,
        qq.question_text,
        qq.options,
        qq.correct_answer
      FROM quiz_questions qq
      JOIN quizzes q ON qq.quiz_id = q.id
      JOIN materials m ON m.category_id = q.category_id
      WHERE m.id = $1
    `;

    const result = await db.query(sql, [materialId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'No quiz available for this material.' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching quiz for student:', error);
    res.status(500).json({ message: 'Failed to fetch quiz' });
  }
};
