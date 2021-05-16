const mySQL = require('mysql') ;

const dbURL = process.env.CLEAR_DB_URL || null;
const connectionOptions = {
  host: 'us-cdbr-east-03.cleardb.com',
  user: 'bddc2288660925',
  password: 'b3d90689',
  database: 'heroku_69c9061e80683c9',
};
var con = mySQL.createConnection(dbURL || connectionOptions);


module.exports = con;