const sql = require("./db.js");
import Expo from "expo-server-sdk";

let expo = new Expo();

const CallCustomer = function(callcustomer) {
  this.id = callcustomer.id;
  this.name = callcustomer.name;
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
  callCustomerExpoToken,
  result
) => {
  sql
    .from("callcustomer")
    .where({
      name: callCustomerName,
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

CallCustomer.orderRecieved = (body, id, result) => {
  let messages = [];

  let ownerToken = [];

  console.log(body.expo_token + " asdf");
  if (!Expo.isExpoPushToken(body.expo_token)) {
    console.log(body.expo_token);
    console.error(
      `push token ${body.expo_token} is not a valid Expo push token`
    );
    result(null);
  } else {
    // for test purpose, callcustomer
    sql("owner")
      .where({ id: id })
      .then(res => {
        ownerToken = res[0].expo_token;
        return res[0].expo_token;
      })
      .then(res => {
        console.log(res);
        messages.push({
          to: res,
          sound: "default",
          body: "This is a text",
          data: {
            target: "TestNumber1234",
            pay: "3000",
            token: body.expo_token
          }
        });
      })
      .then(res => {
        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];
        (async () => {
          // Send the chunks to the Expo push notification service. There are
          // different strategies you could use. A simple one is to send one chunk at a
          // time, which nicely spreads the load out over time:
          for (let chunk of chunks) {
            try {
              let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
              //console.log(ticketChunk);
              tickets.push(...ticketChunk);
              // NOTE: If a ticket contains an error code in ticket.details.error, you
              // must handle it appropriately. The error codes are listed in the Expo
              // documentation:
              // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
            } catch (error) {
              console.error(error);
            }
          }
          result(null, res);
          return;
        })();
      })
      .catch(error => {
        console.log("asdf");
        result(error);
        return;
      });
  }
};

module.exports = CallCustomer;
