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
    //asdf
  }
}

Owner.create = (newOwner, result) => {
  sql.query("INSERT INTO owner SET ?", newOwner, (err, res) => {
    printError(err, result);

    console.log("Created new owner: ", { id: res.insertId, ...newOwner });
    result(null, { id: res.insertId, ...newOwner });
  });
};

Owner.findByUserInfo = (ownerName, ownerPassword, result) => {
  sql.query(
    `SELECT * FROM owner where name = ${ownerName} AND password = ${ownerPassword}`,
    (err, res) => {
      printError(err, result);

      if (res.length) {
        console.log("found owner: ", res[0]);
        result(null, res[0]);
        return;
      }

      result({ kind: "not_found" }, null);
    }
  );
};

Owner.getAll = result => {
  sql.query("SELECT * FROM owner", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("owner : ", res);
    result(null, res);
  });
};

Owner.updateById = (id, owner, result) => {
  sql.query(
    "UPDATE owner SET name = ?, password = ? WHERE id = ?",
    [owner.name, owner.password, id],
    (err, res) => {
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

      console.log("updated owner : ", { id: id, ...owner });
      result(null, { id: id, ...owner });
    }
  );
};

Owner.remove = (id, result) => {
  sql.query("DELETE FROM owner WHERE id = ?", id, (err, res) => {
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

    console.log("deleted owner with id: ", id);
    result(null, res);
  });
};

Owner.removeAll = result => {
  sql.query("DELETE FROM owner", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} owners`);
    result(null, res);
  });
};

module.exports = Owner;
