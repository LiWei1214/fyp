/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('quizzes', function (table) {
    table
      .integer('material_id')
      .unsigned()
      .references('id')
      .inTable('materials')
      .onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('quizzes', function (table) {
    table.dropColumn('material_id');
  });
};
