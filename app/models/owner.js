const sql = require("./db.js");

const Owner = function(owner) {
  this.id = owner.id;
  this.name = owner.name;
  this.password = owner.password;
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
      console.log("Created new owner: ", { id: res.insertID, ...newOwner });
      result(null, { id: res.insertID, ...newOwner });
    })
    .catch(err => {
      printError(err, result);
    });
};

Owner.findByUserInfo = (ownerName, ownerPassword, result) => {
  sql
    .from("owner")
    .where({ name: ownerName, password: ownerPassword })
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

module.exports = Owner;
