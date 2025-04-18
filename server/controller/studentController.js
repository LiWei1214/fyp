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
  const student_id = req.user.id; // ✅ Get student ID from JWT token

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

//To-Do List CRUD
exports.getTodos = (req, res) => {
  const studentId = req.user.id;
  const sql = 'SELECT * FROM todos WHERE student_id = ?';
  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json({error: 'Database error'});
    res.json(results);
  });
};

exports.createTodo = (req, res) => {
  const studentId = req.user.id;
  const {task, status} = req.body;
  const sql = 'INSERT INTO todos (student_id, task, status) VALUES (?, ?, ?)';
  db.query(sql, [studentId, task, status], (err, result) => {
    if (err) return res.status(500).json({error: 'Database error'});
    res.json({message: 'Task added successfully', id: result.insertId});
  });
};

exports.updateTodo = (req, res) => {
  const {task_id, task, status} = req.body;
  const sql = 'UPDATE todos SET task = ?, status = ? WHERE id = ?';
  db.query(sql, [task, status, task_id], (err, result) => {
    if (err) return res.status(500).json({error: 'Database error'});
    res.json({message: 'Task updated successfully'});
  });
};

exports.deleteTodo = (req, res) => {
  const {task_id} = req.body;
  const sql = 'DELETE FROM todos WHERE id = ?';
  db.query(sql, [task_id], (err, result) => {
    if (err) return res.status(500).json({error: 'Database error'});
    res.json({message: 'Task deleted successfully'});
  });
};
