const sql = require("./db.js");

const CallCustomer = function(callcustomer) {
  this.id = callcustomer.id;
  this.name = callcustomer.name;
  this.password = callcustomer.password;
  this.owner_id = callcustomer.owner_id;
};

function printError(err, result) {
  if (err) {
    console.log("error: ", err);
    result(err, null);
    return;
  }
}

CallCustomer.create = (newCallCustomer, result) => {
  sql.query("INSERT INTO callcustomer SET ?", newCallCustomer, (err, res) => {
    printError(err, result);

    console.log("Created new callcustmer: ", {
      id: res.insertId,
      ...newCallCustomer
    });
    result(null, { id: res.insertId, ...newCallCustomer });
  });
};

CallCustomer.findByUserInfo = (
  callCustomerName,
  callCustomerPassword,
  callCustomerOwnerId,
  result
) => {
  sql.query(
    `SELECT * FROM callcustomer where name = ${callCustomerName} AND password = ${callCustomerPassword} AND owner_id = ${callCustomerOwnerId}`,
    (err, res) => {
      printError(err, result);

      if (res.length) {
        console.log("found callcustomer: ", res[0]);
        result(null, res[0]);
        return;
      }

      result({ kind: "not_found" }, null);
    }
  );
};

CallCustomer.getAll = (owner_id, result) => {
  sql.query(
    `SELECT * FROM callcustomer where owner_id = ${owner_id}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("callcustomer : ", res);
      result(null, res);
    }
  );
};

CallCustomer.remove = (id, result) => {
  sql.query("DELETE FROM callcustomer WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted callcustomer with id: ", id);
    result(null, res);
  });
};

CallCustomer.removeAll = (owner_id, result) => {
  sql.query(
    `DELETE FROM callcustomer where owner_id = ${owner_id}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log(`deleted ${res.affectedRows} callcustomer`);
      result(null, res);
    }
  );
};

module.exports = Owner;
