exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(table) {
      table.string('uuid', 36).primary();
      table.string('username', 100).notNullable().unique();
      table.string('pfp_url', 255);
      table.string('password', 255).notNullable();
    })
    .createTable('sessions', function(table) {
      table.string('session_id', 100).primary();
      table.string('token', 80).notNullable().unique();
      table.string('uuid', 36).notNullable();
      table.foreign('uuid').references('users.uuid').onDelete('CASCADE');
    });
};
  
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('sessions')
    .dropTableIfExists('users');
};