/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('categories').del();
  await knex('categories').insert([
    {id: 1, name: 'Mathematics'},
    {id: 2, name: 'Science'},
    {id: 3, name: 'History'},
    {id: 4, name: 'Technology'},
    {id: 5, name: 'Languages'},
    {id: 6, name: 'Business'},
    {id: 7, name: 'Arts'},
    {id: 8, name: 'Coding'},
  ]);
};
