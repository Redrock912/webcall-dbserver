const sql = require("./db.js");
import expo from "expo-server-sdk";

const CallCustomer = function(callcustomer) {
  this.id = callcustomer.id;
  this.name = callcustomer.name;
  this.password = callcustomer.password;
  this.expo_token = callcustomer.expo_token;
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
  callCustomerExpoToken,
  result
) => {
  sql
    .from("callcustomer")
    .where({
      name: callCustomerName,
      password: callCustomerPassword,
      expo_token: callCustomerExpoToken
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

CallCustomer.getAll = result => {
  sql
    .from("callcustomer")
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
    .where({ id: id })
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

CallCustomer.removeAll = result => {
  sql("callcustomer")
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

CallCustomer.orderComplete = token => {
  let messages = [];
  if (!expo.isExpoPushToken(token)) {
    console.error(`push token ${token} is not a valid Expo push token`);
  } else {
    messages.push({
      to: token,
      sound: "default",
      test: "asdf",
      body: "아아 이것은 테스트이다"
    });
  }
};

module.exports = CallCustomer;
