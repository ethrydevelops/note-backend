exports.up = function (knex) {
    return knex.schema.alterTable('notes', function (table) {
        table.timestamps(true, true);
    });
};
  
exports.down = function (knex) {
    return knex.schema.alterTable('notes', function (table) {
        table.dropTimestamps();
    });
};  