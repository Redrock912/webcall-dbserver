const sql = require("./db.js");
import Expo from "expo-server-sdk";

let expo = new Expo();

const Owner = function(owner) {
  // this.id -> can't put result of "insert" into the id, if it is initialized before.
  this.name = owner.name;
  this.expo_token = owner.expo_token;
};

function printError(err, result) {
  if (err) {
    console.log("error: ", err);
    result(err, null);
    return;
  }
}

Owner.create = (newOwner, result) => {
  sql("owner")
    .insert(newOwner)
    .then(res => {
      // knex returns the insert id as result.
      console.log("created owner with id : ", { id: res, ...newOwner });
      result(null, { id: res, ...newOwner });
    })
    .catch(err => {
      printError(err, result);
    });
};

Owner.findByUserInfo = (ownerID, result) => {
  sql
    .from("owner")
    .where({ id: ownerID })
    .then(res => {
      if (res.length) {
        console.log("found owner: ", res[0]);
        result(null, res[0]);
        return;
      }

      result({ kind: "not_found" }, null);
    })
    .catch(err => {
      printError(err, result);
    });
};

Owner.getAll = result => {
  sql
    .from("owner")
    .select()
    .then(res => {
      console.log("owners: ", res);
      result(null, res);
    })
    .catch(err => {
      console.log("error: ", err);
      result(null, err);
      return;
    });
};

Owner.updateById = (id, owner, result) => {
  sql("owner")
    .where("id", id)
    .update({
      name: owner.name,
      password: owner.password
    })
    .then(res => {
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("updated owner: ", { id: id, ...owner });
      result(null, { id: id, ...owner });
    })
    .catch(err => {
      console.log("error: ", err);
      result(null, err);
      return;
    });
};

Owner.remove = (id, result) => {
  sql("owner")
    .where({ id: id })
    .del()
    .then(res => {
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("deleted owner with id: ", id);
      result(null, res);
    })
    .catch(err => {
      console.log("error: ", err);
      result(null, err);
      return;
    });
};

Owner.removeAll = result => {
  sql("owner")
    .del()
    .then(res => {
      console.log(`deleted ${res.affectedRows} owners`);
      result(null, res);
    })
    .catch(err => {
      console.log("error: ", err);
      result(null, err);
      return;
    });
};

Owner.orderRecieved = (body, ownerID, result) => {
  let messages = [];
  let ownerToken = [];

  if (!Expo.isExpoPushToken(body.expo_token)) {
    console.error(
      `push token ${body.expo_token} is not a valid Expo push token`
    );
    result(null);
  } else {
    // for test purpose, callcustomer
    sql("owner")
      .where({ id: ownerID })
      .then(res => {
        ownerToken = res[0].expo_token;
        return res[0].expo_token;
      })
      .then(res => {
        messages.push({
          to: res,
          sound: "default",
          body: "주문이 들어왔습니다. 확인해 주세요.",
          data: {
            target: "OrderListTab",
            name: body.name,
            number: 0,
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

Owner.orderComplete = (number, token, result) => {
  let messages = [];

  if (!Expo.isExpoPushToken(token)) {
    console.log(token);
    console.error(`push token ${token} is not a valid Expo push token`);
    result(null);
    return;
  } else {
    messages.push({
      to: token,
      sound: "default",
      body: "주문이 완료되었습니다. 카운터로 와주세요.",
      data: { target: "OrderListTab", number: number, type: "complete" }
    });

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
    })();
    result(null);
    return;
  }
};

module.exports = Owner;
