const mysql = require("mysql");
import Expo from "expo-server-sdk";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "wc"
});

let textValue = "kim";

connection.connect(err => {
  if (err) throw err;
  console.log("Connected");

  // let sql = "SELECT url From owner WHERE name='" + textValue + "'";
  // connection.query(sql, function(err, result) {
  //   if (err) throw err;

  //   // let newTable =
  //   //   "CREATE TABLE IF NOT EXISTS customer_" +
  //   //   result[0].url +
  //   //   "(id int(11) PRIMARY KEY AUTO_INCREMENT, name varchar(255) NOT NULL, password varchar(255) NOT NULL)";
  //   // connection.query(newTable, function(error, tableResult) {
  //   //   if (error) {
  //   //     console.log("ERROR ON NEWTABLE");
  //   //   } else {
  //   //     console.log(tableResult);
  //   //   }
  //   // });
  // });
});
