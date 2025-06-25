/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .dropTableIfExists('todos')
    .dropTableIfExists('notes')
    .dropTableIfExists('users')
    .dropTableIfExists('lists')
    .dropTableIfExists('folders')
    .dropTableIfExists('quiz_questions')
    .dropTableIfExists('quizzes')
    .dropTableIfExists('materials')
    .dropTableIfExists('user_categories')
    .dropTableIfExists('categories');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
