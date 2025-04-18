/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('todos', table => {
    table.increments('id').unsigned().primary();
    table.integer('student_id').unsigned().notNullable();
    table.string('task', 255).notNullable();
    table.enu('status', ['pending', 'completed']).defaultTo('pending');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('todos');
};
