const AuthService = require("easier-auth");
const knex = require("./database.js");
const auth = new AuthService(knex);

module.exports = auth;