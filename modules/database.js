require("dotenv").config();

const path = require("path");
const environment = process.env.ENVIRONMENT || "development";
const configuration = require(path.join(__dirname, "..", "knexfile"))[environment];
const knex = require("knex")(configuration);

module.exports = knex;