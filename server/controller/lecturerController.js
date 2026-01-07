const db = require('../db/db');
const path = require('path');
const fs = require('fs').promises;

// const uploadMaterial = (req, res) => {
//   const {title, description, category_id, isQuizEnabled, quizQuestions} =
//     req.body;
//   const uploaded_by = req.user.id;
//   // console.log('req.file:', req.file);
//   // console.log('req.body:', req.body);

//   if (!req.file) {
//     return res.status(400).json({message: 'No file uploaded.'});
//   }

//   const file_path = `/uploads/${req.file.filename}`;
//   const file_type = req.file.mimetype;
//   const quizEnabledValue = isQuizEnabled === 'true' ? 1 : 0;

//   db.beginTransaction(err => {
//     if (err) {
//       console.error('Error starting transaction:', err);
//       return res.status(500).json({message: 'Upload failed', error: err});
//     }

//     // 1. Insert the material
//     const materialQuery = `
//       INSERT INTO materials (title, description, category_id, uploaded_by, file_path, file_type, isQuizEnabled)
//       VALUES (?, ?, ?, ?, ?, ?, ?)
//       `;
//     db.query(
//       materialQuery,
//       [
//         title,
//         description,
//         category_id,
//         uploaded_by,
//         file_path,
//         file_type,
//         quizEnabledValue,
//       ],
//       (error, materialResult) => {
//         if (error) {
//           return db.rollback(() => {
//             console.error('Error uploading material:', error);
//             return res.status(500).json({message: 'Upload failed', error});
//           });
//         }

//         const materialId = materialResult.insertId;

//         // 2. Handle quiz creation if enabled
//         if (isQuizEnabled === 'true' && quizQuestions) {
//           let parsedQuestions;
//           try {
//             parsedQuestions = JSON.parse(quizQuestions);
//           } catch (parseError) {
//             return db.rollback(() => {
//               console.error('Error parsing quiz questions:', parseError);
//               return res.status(400).json({
//                 message: 'Upload failed: Invalid quiz data',
//                 error: parseError,
//               });
//             });
//           }

//           const quizTitle = `${title} Quiz`;
//           const quizInsertQuery = `
//             INSERT INTO quizzes (title, category_id, created_by, material_id)
//             VALUES (?, ?, ?, ?)
//           `;
//           db.query(
//             quizInsertQuery,
//             [quizTitle, category_id, uploaded_by, materialId],
//             (quizError, quizResult) => {
//               if (quizError) {
//                 return db.rollback(() => {
//                   console.error('Error creating quiz:', quizError);
//                   return res.status(500).json({
//                     message: 'Upload failed: Error creating quiz',
//                     error: quizError,
//                   });
//                 });
//               }

//               const quizId = quizResult.insertId;
//               const questionsToInsert = parsedQuestions.map(question => [
//                 quizId,
//                 question.question_text,
//                 JSON.stringify(question.options),
//                 question.correct_answer,
//               ]);

//               if (questionsToInsert.length > 0) {
//                 const placeholders = questionsToInsert
//                   .map(() => '(?, ?, ?, ?)')
//                   .join(',');
//                 const values = questionsToInsert.flat();
//                 const quizQuestionsInsertQuery = `
//                 INSERT INTO quiz_questions (quiz_id, question_text, options, correct_answer)
//                 VALUES ${placeholders}
//               `;

//                 db.query(
//                   quizQuestionsInsertQuery,
//                   values,
//                   quizQuestionsError => {
//                     if (quizQuestionsError) {
//                       return db.rollback(() => {
//                         console.error(
//                           'Error inserting quiz questions:',
//                           quizQuestionsError,
//                         );
//                         return res.status(500).json({
//                           message:
//                             'Upload failed: Error creating quiz questions',
//                           error: quizQuestionsError,
//                         });
//                       });
//                     }

//                     db.commit(commitErr => {
//                       if (commitErr) {
//                         console.error(
//                           'Error committing transaction:',
//                           commitErr,
//                         );
//                         return res
//                           .status(500)
//                           .json({message: 'Upload failed', error: commitErr});
//                       }
//                       return res.status(200).json({
//                         message: 'Material uploaded successfully',
//                         materialId,
//                       });
//                     });
//                   },
//                 );
//               } else {
//                 db.commit(commitErr => {
//                   if (commitErr) {
//                     console.error('Error committing transaction:', commitErr);
//                     return res
//                       .status(500)
//                       .json({message: 'Upload failed', error: commitErr});
//                   }
//                   return res.status(200).json({
//                     message: 'Material uploaded successfully',
//                     materialId,
//                   });
//                 });
//               }
//             },
//           );
//         } else {
//           db.commit(commitErr => {
//             if (commitErr) {
//               console.error('Error committing transaction:', commitErr);
//               return res
//                 .status(500)
//                 .json({message: 'Upload failed', error: commitErr});
//             }
//             return res
//               .status(200)
//               .json({message: 'Material uploaded successfully', materialId});
//           });
//         }
//       },
//     );
//   });
// };
const uploadMaterial = async (req, res) => {
  const client = await db.connect();

  try {
    const { title, description, category_id, isQuizEnabled, quizQuestions } =
      req.body;

    const uploaded_by = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const file_path = `/uploads/${req.file.filename}`;
    const file_type = req.file.mimetype;
    const quizEnabledValue = isQuizEnabled === 'true';

    await client.query('BEGIN');

    /* 1️⃣ Insert material */
    const materialResult = await client.query(
      `
      INSERT INTO materials
        (title, description, category_id, uploaded_by, file_path, file_type, isQuizEnabled)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
      `,
      [
        title,
        description,
        category_id,
        uploaded_by,
        file_path,
        file_type,
        quizEnabledValue,
      ]
    );

    const materialId = materialResult.rows[0].id;

    /* 2️⃣ Quiz handling */
    if (quizEnabledValue && quizQuestions) {
      const parsedQuestions = JSON.parse(quizQuestions);

      const quizResult = await client.query(
        `
        INSERT INTO quizzes (title, category_id, created_by, material_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        `,
        [`${title} Quiz`, category_id, uploaded_by, materialId]
      );

      const quizId = quizResult.rows[0].id;

      for (const q of parsedQuestions) {
        await client.query(
          `
          INSERT INTO quiz_questions
            (quiz_id, question_text, options, correct_answer)
          VALUES ($1, $2, $3, $4)
          `,
          [quizId, q.question_text, q.options, q.correct_answer]
        );
      }
    }

    await client.query('COMMIT');

    res.status(200).json({
      message: 'Material uploaded successfully',
      materialId,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  } finally {
    client.release();
  }
};

// const getUploadedMaterials = (req, res) => {
//   const uploaded_by = req.user.id;
//   const query = `
//       SELECT id, title, description, file_path, file_type, created_at,
//              (SELECT name FROM categories WHERE id = materials.category_id) AS category_name
//       FROM materials
//       WHERE uploaded_by = ?
//       ORDER BY created_at DESC;
//     `;

//   db.query(query, [uploaded_by], (error, results) => {
//     if (error) {
//       console.error('Error fetching uploaded materials:', error);
//       return res
//         .status(500)
//         .json({message: 'Failed to fetch uploaded materials', error});
//     }
//     res.status(200).json({materials: results});
//   });
// };
// const getUploadedMaterials = async (req, res) => {
//   try {
//     const uploaded_by = req.user.id;

//     const result = await db.query(
//       `
//       SELECT
//         m.id,
//         m.title,
//         m.description,
//         m.file_path,
//         m.file_type,
//         m.created_at,
//         c.name AS category_name
//       FROM materials m
//       JOIN categories c ON c.id = m.category_id
//       WHERE m.uploaded_by = $1
//       ORDER BY m.created_at DESC
//       `,
//       [uploaded_by]
//     );

//     res.status(200).json({ materials: result.rows });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to fetch uploaded materials' });
//   }
// };
const getUploadedMaterials = async (req, res) => {
  try {
    const uploaded_by = req.user.id;

    const result = await db.query(
      `
      SELECT
        m.id,
        m.title,
        m.description,
        m.file_path,
        m.file_type,
        m.created_at,
        c.name AS category_name
      FROM materials m
      JOIN categories c ON c.id = m.category_id
      WHERE m.uploaded_by = $1
      ORDER BY m.created_at DESC
      `,
      [uploaded_by]
    );

    res.status(200).json({ materials: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch uploaded materials' });
  }
};

// const deleteMaterial = async (req, res) => {
//   const materialId = req.params.id;
//   const uploaded_by = req.user.id;

//   try {
//     // 1. Get material info
//     const [materialResult] = await db
//       .promise()
//       .query(
//         'SELECT file_path, category_id FROM materials WHERE id = ? AND uploaded_by = ?',
//         [materialId, uploaded_by]
//       );

//     if (materialResult.length === 0) {
//       return res
//         .status(404)
//         .json({ message: 'Material not found or unauthorized.' });
//     }

//     const { file_path, category_id } = materialResult[0];
//     const fileToDelete = path.join(
//       __dirname,
//       '../uploads',
//       file_path.replace('/uploads/', '')
//     );

//     // 2. Find and delete related quizzes and questions (if any)
//     const [quizResults] = await db
//       .promise()
//       .query(
//         'SELECT id FROM quizzes WHERE category_id = ? AND created_by = ?',
//         [category_id, uploaded_by]
//       );

//     if (quizResults.length > 0) {
//       const quizId = quizResults[0].id;

//       // Delete quiz questions
//       await db
//         .promise()
//         .query('DELETE FROM quiz_questions WHERE quiz_id = ?', [quizId]);

//       // Delete quiz itself
//       await db.promise().query('DELETE FROM quizzes WHERE id = ?', [quizId]);
//     }

//     // 3. Delete material
//     await db
//       .promise()
//       .query('DELETE FROM materials WHERE id = ? AND uploaded_by = ?', [
//         materialId,
//         uploaded_by,
//       ]);

//     // 4. Delete physical file
//     try {
//       await fs.unlink(fileToDelete);
//       console.log(`File deleted: ${fileToDelete}`);
//     } catch (err) {
//       console.warn('File deletion failed:', err.message);
//     }

//     res
//       .status(200)
//       .json({ message: 'Material and related quiz deleted successfully.' });
//   } catch (error) {
//     console.error('Error deleting material with quiz:', error);
//     return res
//       .status(500)
//       .json({ message: 'Failed to delete material and quiz.', error });
//   }
// };

const deleteMaterial = async (req, res) => {
  const client = await db.connect();
  const materialId = req.params.id;
  const uploaded_by = req.user.id;

  try {
    await client.query('BEGIN');

    const materialResult = await client.query(
      `
      SELECT file_path
      FROM materials
      WHERE id = $1 AND uploaded_by = $2
      `,
      [materialId, uploaded_by]
    );

    if (materialResult.rows.length === 0) {
      return res.status(404).json({ message: 'Material not found.' });
    }

    const file_path = materialResult.rows[0].file_path;

    await client.query(
      `DELETE FROM quiz_questions WHERE quiz_id IN
       (SELECT id FROM quizzes WHERE material_id = $1)`,
      [materialId]
    );

    await client.query(`DELETE FROM quizzes WHERE material_id = $1`, [
      materialId,
    ]);

    await client.query(
      `DELETE FROM materials WHERE id = $1 AND uploaded_by = $2`,
      [materialId, uploaded_by]
    );

    await client.query('COMMIT');

    try {
      const fileToDelete = path.join(
        __dirname,
        '../uploads',
        file_path.replace('/uploads/', '')
      );
      await fs.unlink(fileToDelete);
    } catch {}

    res.status(200).json({
      message: 'Material and related quiz deleted successfully.',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Delete failed' });
  } finally {
    client.release();
  }
};

// const updateMaterial = (req, res) => {
//   const materialId = req.params.id;
//   const { title, description, category_id, isQuizEnabled, quizQuestions } =
//     req.body;
//   const uploaded_by = req.user.id;
//   const file = req.file;
//   const filePath = file ? `/uploads/${file.filename}` : null;

//   db.beginTransaction(async (err) => {
//     if (err) {
//       console.error('Error starting transaction:', err);
//       return res.status(500).json({ message: 'Update failed', error: err });
//     }

//     try {
//       // 1. Update material details
//       const updateMaterialQuery = `
//       UPDATE materials
//       SET title = ?, description = ?, category_id = ?, isQuizEnabled = ?, file_path = COALESCE(?, file_path)
//       WHERE id = ? AND uploaded_by = ?
//     `;
//       const quizEnabledValue = isQuizEnabled === 'true' ? 1 : 0;

//       await db
//         .promise()
//         .query(updateMaterialQuery, [
//           title,
//           description,
//           category_id,
//           quizEnabledValue,
//           filePath,
//           materialId,
//           uploaded_by,
//         ]);

//       // 2. Handle quiz updates if enabled
//       if (isQuizEnabled === 'true' && quizQuestions) {
//         let parsedQuestions;
//         try {
//           parsedQuestions = JSON.parse(quizQuestions);
//         } catch (parseError) {
//           await db.promise().rollback();
//           console.error('Error parsing quiz questions:', parseError);
//           return res.status(400).json({
//             message: 'Update failed: Invalid quiz data',
//             error: parseError,
//           });
//         }

//         // Fetch existing quiz question IDs for this category and lecturer
//         const [existingQuizRecords] = await db.promise().query(
//           `
//             SELECT qq.id
//             FROM quizzes q
//             JOIN quiz_questions qq ON q.id = qq.quiz_id
//             WHERE q.material_id = ? AND q.created_by = ?
//           `,
//           [materialId, uploaded_by]
//         );
//         const existingQuestionIds = existingQuizRecords.map(
//           (record) => record.id
//         );

//         // Identify questions to delete
//         const questionsToDelete = existingQuestionIds.filter(
//           (existingId) => !parsedQuestions.some((q) => q.id === existingId)
//         );

//         // Delete removed questions
//         for (const deleteId of questionsToDelete) {
//           await db.promise().query(
//             `
//               DELETE FROM quiz_questions
//               WHERE id = ?
//             `,
//             [deleteId]
//           );
//         }

//         // Process updates and new questions
//         const promises = parsedQuestions.map((question) => {
//           return new Promise(async (resolve, reject) => {
//             if (question.id && question._status === 'updated') {
//               try {
//                 await db.promise().query(
//                   `
//                     UPDATE quiz_questions
//                     SET question_text = ?, options = ?, correct_answer = ?
//                     WHERE id = ?
//                   `,
//                   [
//                     question.question_text,
//                     JSON.stringify(question.options),
//                     question.correct_answer,
//                     question.id,
//                   ]
//                 );
//                 resolve();
//               } catch (err) {
//                 reject(err);
//               }
//             } else if (!question.id || question._status === 'new') {
//               const [quizResults] = await db.promise().query(
//                 `
//                   SELECT id FROM quizzes WHERE material_id  = ? AND created_by = ? LIMIT 1
//                 `,
//                 [materialId, uploaded_by]
//               );
//               let quizId;
//               if (quizResults.length > 0) {
//                 quizId = quizResults[0].id;
//                 try {
//                   await db.promise().query(
//                     `
//                       INSERT INTO quiz_questions (quiz_id, question_text, options, correct_answer)
//                       VALUES (?, ?, ?, ?)
//                     `,
//                     [
//                       quizId,
//                       question.question_text,
//                       JSON.stringify(question.options),
//                       question.correct_answer,
//                     ]
//                   );
//                   resolve();
//                 } catch (err) {
//                   reject(err);
//                 }
//               } else if (question.question_text) {
//                 // Create a new quiz if it doesn't exist
//                 const [newQuizResult] = await db.promise().query(
//                   `
//                     INSERT INTO quizzes (title, category_id, created_by, material_id)
//                     VALUES (?, ?, ?, ?)
//                   `,
//                   [`${title} Quiz`, category_id, uploaded_by, materialId]
//                 );
//                 const newQuizId = newQuizResult.insertId;
//                 await db.promise().query(
//                   `
//                     INSERT INTO quiz_questions (quiz_id, question_text, options, correct_answer)
//                     VALUES (?, ?, ?, ?)
//                   `,
//                   [
//                     newQuizId,
//                     question.question_text,
//                     JSON.stringify(question.options),
//                     question.correct_answer,
//                   ]
//                 );
//                 resolve();
//               } else {
//                 resolve();
//               }
//             } else {
//               resolve();
//             }
//           });
//         });

//         await Promise.all(promises);
//       }

//       await db.promise().commit();
//       res.status(200).json({ message: 'Material updated successfully' });
//     } catch (error) {
//       await db.promise().rollback();
//       console.error('Error updating material:', error);
//       res.status(500).json({ message: 'Update failed', error });
//     }
//   });
// };
const updateMaterial = async (req, res) => {
  const client = await db.connect();

  try {
    const materialId = req.params.id;
    const uploaded_by = req.user.id;
    const { title, description, category_id, isQuizEnabled, quizQuestions } =
      req.body;

    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    await client.query('BEGIN');

    await client.query(
      `
      UPDATE materials
      SET title = $1,
          description = $2,
          category_id = $3,
          isQuizEnabled = $4,
          file_path = COALESCE($5, file_path)
      WHERE id = $6 AND uploaded_by = $7
      `,
      [
        title,
        description,
        category_id,
        isQuizEnabled === 'true',
        filePath,
        materialId,
        uploaded_by,
      ]
    );

    if (isQuizEnabled === 'true' && quizQuestions) {
      const parsed = JSON.parse(quizQuestions);

      const quizResult = await client.query(
        `SELECT id FROM quizzes WHERE material_id = $1 AND created_by = $2`,
        [materialId, uploaded_by]
      );

      let quizId =
        quizResult.rows[0]?.id ||
        (
          await client.query(
            `
            INSERT INTO quizzes (title, category_id, created_by, material_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id
            `,
            [`${title} Quiz`, category_id, uploaded_by, materialId]
          )
        ).rows[0].id;

      await client.query(`DELETE FROM quiz_questions WHERE quiz_id = $1`, [
        quizId,
      ]);

      for (const q of parsed) {
        await client.query(
          `
          INSERT INTO quiz_questions
            (quiz_id, question_text, options, correct_answer)
          VALUES ($1, $2, $3, $4)
          `,
          [quizId, q.question_text, q.options, q.correct_answer]
        );
      }
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Material updated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Update failed' });
  } finally {
    client.release();
  }
};

// const getMaterialById = async (req, res) => {
//   const materialId = req.params.id;
//   const uploaded_by = req.user.id;
//   //   console.log(
//   //     'Fetching material with ID:',
//   //     materialId,
//   //     'by user:',
//   //     uploaded_by,
//   //   );

//   try {
//     const [material] = await db.promise().query(
//       `
//         SELECT id, title, description, category_id, file_path
//         FROM materials
//         WHERE id = ? AND uploaded_by = ?
//       `,
//       [materialId, uploaded_by]
//     );
//     console.log('Database result:', material);

//     if (material.length === 0) {
//       return res
//         .status(404)
//         .json({ message: 'Material not found or unauthorized.' });
//     }

//     res.status(200).json({ material: material[0] });
//   } catch (error) {
//     console.error('Error fetching material by ID:', error);
//     return res
//       .status(500)
//       .json({ message: 'Failed to fetch material.', error });
//   }
// };
const getMaterialById = async (req, res) => {
  const { id } = req.params;
  const uploaded_by = req.user.id;

  try {
    const result = await db.query(
      `
      SELECT id, title, description, category_id, file_path
      FROM materials
      WHERE id = $1 AND uploaded_by = $2
      `,
      [id, uploaded_by]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.status(200).json({ material: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch material' });
  }
};

// const getQuizzesByCategory = (req, res) => {
//   const { categoryId } = req.params;
//   const uploaded_by = req.user.id;

//   db.query(
//     `
//         SELECT q.id AS quiz_id, qq.id, qq.question_text, qq.options, qq.correct_answer
//         FROM quizzes q
//         JOIN quiz_questions qq ON q.id = qq.quiz_id
//         WHERE q.category_id = ? AND q.created_by = ?
//       `,
//     [categoryId, uploaded_by],
//     (err, results) => {
//       if (err) {
//         console.error('Error fetching quizzes by category:', err);
//         return res
//           .status(500)
//           .json({ message: 'Failed to fetch quizzes', error: err });
//       }
//       res.status(200).json(results);
//     }
//   );
// };
const getQuizzesByCategory = async (req, res) => {
  const { categoryId } = req.params;
  const uploaded_by = req.user.id;

  try {
    const result = await db.query(
      `
      SELECT q.id AS quiz_id, qq.id, qq.question_text, qq.options, qq.correct_answer
      FROM quizzes q
      JOIN quiz_questions qq ON q.id = qq.quiz_id
      WHERE q.category_id = $1 AND q.created_by = $2
      `,
      [categoryId, uploaded_by]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch quizzes' });
  }
};

// const getQuizQuestionsByMaterialId = async (req, res) => {
//   const materialId = req.params.materialId;
//   try {
//     const [rows] = await db.promise().query(
//       `SELECT qq.id, qq.question_text, qq.options, qq.correct_answer
//        FROM quiz_questions qq
//        JOIN quizzes q ON qq.quiz_id = q.id
//        WHERE q.material_id = ?`,
//       [materialId]
//     );

//     const formatted = rows.map((row) => ({
//       id: row.id,
//       question_text: row.question_text,
//       options: JSON.parse(row.options),
//       correct_answer: row.correct_answer,
//     }));

//     res.status(200).json(formatted);
//   } catch (err) {
//     console.error('Error fetching quiz questions:', err);
//     res.status(500).json({ message: 'Failed to fetch quiz questions' });
//   }
// };
const getQuizQuestionsByMaterialId = async (req, res) => {
  const { materialId } = req.params;

  try {
    const result = await db.query(
      `
      SELECT qq.id, qq.question_text, qq.options, qq.correct_answer
      FROM quiz_questions qq
      JOIN quizzes q ON qq.quiz_id = q.id
      WHERE q.material_id = $1
      `,
      [materialId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch quiz questions' });
  }
};

module.exports = {
  uploadMaterial,
  getUploadedMaterials,
  deleteMaterial,
  updateMaterial,
  getMaterialById,
  getQuizzesByCategory,
  getQuizQuestionsByMaterialId,
};
