/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('todos', table => {
    // table.increments('id').unsigned().primary();
    // table.integer('student_id').unsigned().notNullable();
    // table.string('task', 255).notNullable();
    // table.enu('status', ['pending', 'completed']).defaultTo('pending');
    // table.timestamp('created_at').defaultTo(knex.fn.now());
    table.increments('id').primary();
    table.integer('student_id').unsigned().notNullable();
    table.string('title').notNullable();
    table.text('description');
    table.boolean('is_completed').defaultTo(false);
    table.timestamp('due_date');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.integer('list_id').unsigned().nullable();
    table
      .foreign('list_id')
      .references('id')
      .inTable('lists')
      .onDelete('SET NULL');

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
  return knex.schema.dropTableIfExists('todos');
};
