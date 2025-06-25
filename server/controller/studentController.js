const db = require('../db/db');

// Note CRUD
exports.getNotes = (req, res) => {
  const studentId = req.user.id;
  const sql = 'SELECT * FROM notes WHERE student_id = ?';
  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json({error: 'Database error'});
    res.json(results);
  });
};

exports.createNote = (req, res) => {
  const {title, content} = req.body;
  const student_id = req.user.id;

  if (!title || !content) {
    return res.status(400).json({error: 'Title and content are required'});
  }

  const sql = 'INSERT INTO notes (student_id, title, content) VALUES (?, ?, ?)';
  db.query(sql, [student_id, title, content], (err, result) => {
    if (err) return res.status(500).json({error: 'Database error'});

    res.json({message: 'Note created successfully', noteId: result.insertId});
  });
};

exports.updateNote = (req, res) => {
  const {id} = req.params;
  const {title, content} = req.body;
  const sql = 'UPDATE notes SET title = ?, content = ? WHERE id = ?';
  db.query(sql, [title, content, id], (err, result) => {
    if (err) return res.status(500).json({error: 'Database error'});
    res.json({message: 'Note updated successfully'});
  });
};

exports.deleteNote = (req, res) => {
  const {id} = req.params;
  const sql = 'DELETE FROM notes WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({error: 'Database error'});
    res.json({message: 'Note deleted successfully'});
  });
};

// To-Do List CRUD
exports.getTodos = (req, res) => {
  const studentId = req.user.id;
  const sql = 'SELECT * FROM todos WHERE student_id = ?';
  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json({error: 'Database error'});
    res.json(results);
  });
};

exports.getTodosWithType = (req, res) => {
  const studentId = req.user.id;
  const sql =
    'SELECT id, title, is_completed, due_date FROM todos WHERE student_id = ?';
  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json({error: 'Database error'});

    const todos = results.map(todo => {
      const dueDate = new Date(todo.due_date);
      const dueYear = dueDate.getFullYear();
      const dueMonth = dueDate.getMonth();
      const dueDay = dueDate.getDate();

      const todayDate = new Date();
      const todayYear = todayDate.getFullYear();
      const todayMonth = todayDate.getMonth();
      const todayDay = todayDate.getDate();

      const thisMonthYear = todayDate.getFullYear();
      const thisMonthMonth = todayDate.getMonth();

      let type = 'other';
      if (
        dueYear === todayYear &&
        dueMonth === todayMonth &&
        dueDay === todayDay
      ) {
        type = 'daily';
      } else if (dueYear === thisMonthYear && dueMonth === thisMonthMonth) {
        type = 'monthly';
      }

      return {...todo, type};
    });

    res.json(todos);
  });
};

exports.createTodo = (req, res) => {
  const {title, description, due_date, list_id} = req.body;
  const studentId = req.user.id; // Assuming JWT is used to get student ID

  if (!title) {
    return res.status(400).json({error: 'Task title is required'});
  }

  const sql =
    'INSERT INTO todos (student_id, title, description, due_date, list_id) VALUES (?, ?, ?, ?, ?)';
  db.query(
    sql,
    [studentId, title, description, due_date, list_id],
    (err, result) => {
      if (err) return res.status(500).json({error: 'Database error'});
      res
        .status(201)
        .json({message: 'Task created successfully', id: result.insertId});
    },
  );
};

exports.updateTodo = (req, res) => {
  const {id} = req.params;
  const {title, description, due_date, is_completed} = req.body;

  console.log('Updating todo with ID:', id);
  console.log('Received data:', {title, description, due_date, is_completed});

  const sql =
    'UPDATE todos SET title = ?, description = ?, due_date = ?, is_completed = ? WHERE id = ?';
  db.query(
    sql,
    [title, description, due_date, is_completed, id],
    (err, result) => {
      if (err) {
        console.error('Database error during todo update:', err);
        return res.status(500).json({error: 'Database error'});
      }
      console.log('Update result:', result); // Log the result of the query
      res.json({message: 'Task updated successfully'});
    },
  );
};

// Delete a task
exports.deleteTodo = (req, res) => {
  const {id} = req.params;
  const studentId = req.user.id;

  const sql = 'DELETE FROM todos WHERE id = ? AND student_id = ?';
  db.query(sql, [id, studentId], (err, result) => {
    if (err) {
      console.error('Database error deleting todo:', err);
      return res.status(500).json({error: 'Database error'});
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({error: 'Task not found or does not belong to the user'});
    }
    res.json({message: 'Task deleted successfully', id});
  });
};

exports.getLists = (req, res) => {
  const studentId = req.user.id;

  const sql = 'SELECT * FROM lists WHERE student_id = ?';
  db.query(sql, [studentId], (err, results) => {
    if (err) {
      console.error('Database error fetching lists:', err);
      return res.status(500).json({error: 'Database error'});
    }
    res.json(results);
  });
};

// Create a new list
exports.createList = (req, res) => {
  const {name} = req.body;
  const studentId = req.user.id;

  if (!name) {
    return res.status(400).json({error: 'List name is required'});
  }

  const sql = 'INSERT INTO lists (student_id, name) VALUES (?, ?)';
  db.query(sql, [studentId, name], (err, result) => {
    if (err) {
      console.error('Database error creating list:', err);
      return res.status(500).json({error: 'Database error'});
    }
    res
      .status(201)
      .json({message: 'List created successfully', id: result.insertId, name});
  });
};

// Update an existing list name
exports.updateList = (req, res) => {
  const {id} = req.params;
  const {name} = req.body;
  const studentId = req.user.id;

  if (!name) {
    return res.status(400).json({error: 'New list name is required'});
  }

  const sql = 'UPDATE lists SET name = ? WHERE id = ? AND student_id = ?';
  db.query(sql, [name, id, studentId], (err, result) => {
    if (err) {
      console.error('Database error updating list:', err);
      return res.status(500).json({error: 'Database error'});
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({error: 'List not found or does not belong to the user'});
    }
    res.json({message: 'List updated successfully', id, name});
  });
};

// Delete a list
exports.deleteList = (req, res) => {
  const {id} = req.params;
  const studentId = req.user.id;

  const sql = 'DELETE FROM lists WHERE id = ? AND student_id = ?';
  db.query(sql, [id, studentId], (err, result) => {
    if (err) {
      console.error('Database error deleting list:', err);
      return res.status(500).json({error: 'Database error'});
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({error: 'List not found or does not belong to the user'});
    }
    res.json({message: 'List deleted successfully', id});
  });
};

exports.getAllMaterialsForStudents = (req, res) => {
  db.query(
    `
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
    `,
    (error, results) => {
      if (error) {
        console.error('Error fetching materials for students:', error);
        res
          .status(500)
          .json({message: 'Failed to fetch materials', error: error.message});
      } else {
        res.status(200).json(results);
      }
    },
  );
};

exports.getStudentQuizByMaterialId = async (req, res) => {
  const {materialId} = req.params;

  try {
    const [results] = await db.promise().query(
      `
      SELECT q.id AS quiz_id, qq.id AS question_id, qq.question_text, qq.options, qq.correct_answer
      FROM quizzes q
      JOIN quiz_questions qq ON q.id = qq.quiz_id
      WHERE q.material_id = ?
      `,
      [materialId],
    );

    if (results.length === 0) {
      return res
        .status(404)
        .json({message: 'No quiz found for this material.'});
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching quiz by material ID:', error);
    res.status(500).json({message: 'Failed to fetch quiz.', error});
  }
};

exports.getQuizByCategoryForStudent = (req, res) => {
  const materialId = req.params.materialId;

  const quizQuery = `
    SELECT qq.id, qq.question_text, qq.options, qq.correct_answer
    FROM quiz_questions qq
    JOIN quizzes q ON qq.quiz_id = q.id
    JOIN materials m ON m.category_id = q.category_id
    WHERE m.id = ?
  `;

  db.query(quizQuery, [materialId], (error, results) => {
    if (error) {
      console.error('Error fetching quiz for student:', error);
      return res.status(500).json({message: 'Failed to fetch quiz', error});
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({message: 'No quiz available for this material.'});
    }

    const formatted = results.map(row => ({
      id: row.id,
      question_text: row.question_text,
      options: JSON.parse(row.options),
      correct_answer: row.correct_answer,
    }));

    res.status(200).json(formatted);
  });
};
