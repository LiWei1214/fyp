// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      port: 3307,
      user: 'root',
      password: '12345',
      database: 'personal_learning_db',
    },
  },

  staging: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      port: 3307,
      user: 'root',
      password: '12345',
      database: 'personal_learning_db_staging',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      port: 3307,
      user: 'root',
      password: '12345',
      database: 'personal_learning_db_production',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
