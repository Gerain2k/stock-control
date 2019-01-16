const mysql = require('mysql');
module.exports = pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'dbAdmin',
  port: 3306,
  password: 'pass',
  database: 'db'
});
