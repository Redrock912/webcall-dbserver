const mysql = require("mysql");
const config = require("../config/db.config.js");

const knex = require("knex")({
  client: "mysql",
  connection: {
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DB
  }
});

module.exports = knex;
