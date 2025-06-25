/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('quizzes', table => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table
      .integer('category_id')
      .unsigned()
      .references('id')
      .inTable('categories')
      .onDelete('SET NULL');
    table
      .integer('created_by')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
