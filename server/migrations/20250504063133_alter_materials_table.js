/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('materials', table => {
    table.renameColumn('file_url', 'file_path');
    table.boolean('isQuizEnabled').defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('materials', table => {
    // Reversing the changes in down
    table.renameColumn('file_path', 'file_url');
    table.dropColumn('isQuizEnabled');
  });
};
