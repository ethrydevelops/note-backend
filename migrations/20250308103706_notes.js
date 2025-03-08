exports.up = function(knex) {
    return knex.schema.createTable('notes', function(table) {
        table.string('id', 40).primary();
        table.string('title', 100).notNullable();
        table.string('content', 2000).notNullable();
        
        table.string('uuid', 36).notNullable();
        table.foreign('uuid').references('users.uuid').onDelete('CASCADE');
    });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('notes');
};