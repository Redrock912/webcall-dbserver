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

CallCustomer.orderComplete = (token, result) => {
  let messages = [];

  if (!Expo.isExpoPushToken(token.expo_token)) {
    console.log(token.expo_token);
    console.error(`push token ${token} is not a valid Expo push token`);
    result(null);
  } else {
    messages.push({
      to: token.expo_token,
      sound: "default",
      body: "This is a test notification",
      data: "testing string"
    });
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
      } catch (error) {
        console.error(error);
      }
    }
  })();

  // let receiptIds = [];
  // for (let ticket of tickets) {
  //   // NOTE: Not all tickets have IDs; for example, tickets for notifications
  //   // that could not be enqueued will have error information and no receipt ID.
  //   if (ticket.id) {
  //     receiptIds.push(ticket.id);
  //   }
  // }

  // let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  // (async () => {
  //   // Like sending notifications, there are different strategies you could use
  //   // to retrieve batches of receipts from the Expo service.
  //   for (let chunk of receiptIdChunks) {
  //     try {
  //       let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
  //       console.log(receipts);
  //       console.log("zxcv");
  //       // The receipts specify whether Apple or Google successfully received the
  //       // notification and information about an error, if one occurred.
  //       for (let receipt of receipts) {
  //         if (receipt.status === "ok") {
  //           console.log("qwer");
  //           continue;
  //         } else if (receipt.status === "error") {
  //           console.error(
  //             `There was an error sending a notification: ${receipt.message}`
  //           );
  //           if (receipt.details && receipt.details.error) {
  //             // The error codes are listed in the Expo documentation:
  //             // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
  //             // You must handle the errors appropriately.
  //             console.error(`The error code is ${receipt.details.error}`);
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // })();
};

module.exports = CallCustomer;
