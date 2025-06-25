/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('lists', function (table) {
    table.increments('id').primary();
    table.integer('student_id').unsigned().notNullable();
    table.string('name').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table
      .foreign('student_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('lists');
};
