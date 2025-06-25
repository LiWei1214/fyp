/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('quiz_questions', table => {
    table.increments('id').primary();
    table
      .integer('quiz_id')
      .unsigned()
      .references('id')
      .inTable('quizzes')
      .onDelete('CASCADE');
    table.text('question_text').notNullable();
    table.json('options').notNullable(); // e.g. ["A", "B", "C", "D"]
    table.string('correct_answer').notNullable(); // e.g. "A"
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('quiz_questions');
};
