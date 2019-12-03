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
  sql("callcustomer")
    .insert(newCallCustomer)
    .then(res => {
      console.log("Created new callcustmer: ", {
        id: res.insertId,
        ...newCallCustomer
      });
      result(null, { id: res.insertId, ...newCallCustomer });
    })
    .catch(err => {
      printError(err, result);
    });
};

CallCustomer.findByUserInfo = (
  callCustomerName,
  callCustomerPassword,
  callCustomerOwnerId,
  result
) => {
  sql
    .from("callcustomer")
    .where({
      name: callCustomerName,
      password: callCustomerPassword,
      owner_id: callCustomerOwnerId
    })
    .then(res => {
      if (res.length) {
        console.log("found callcustomer: ", res[0]);
        result(null, res[0]);
        return;
      }

      result({ kind: "not_found" }, null);
    })
    .catch(err => {
      printError(err, result);
    });
};

CallCustomer.getAll = (owner_id, result) => {
  sql
    .from("callcustomer")
    .where("owner_id", owner_id)
    .then(res => {
      console.log("callcustomer : ", res);
      result(null, res);
    })
    .catch(err => {
      console.log("error: ", err);
      result(null, err);
      return;
    });
};

CallCustomer.remove = (id, result) => {
  sql("callcustomer")
    .where("id", id)
    .del()
    .then(res => {
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("deleted callcustomer with id: ", id);
      result(null, res);
    })
    .catch(err => {
      console.log("error: ", err);
      result(null, err);
      return;
    });
};

CallCustomer.removeAll = (owner_id, result) => {
  sql("callcustomer")
    .where("owner_id", owner_id)
    .del()
    .then(res => {
      console.log(`deleted ${res.affectedRows} callcustomer`);
      result(null, res);
    })
    .catch(err => {
      console.log("error: ", err);
      result(null, err);
      return;
    });
};

module.exports = CallCustomer;
