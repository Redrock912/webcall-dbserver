const CallCustomer = require("../models/callcustomer.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content is empty right now. Fill in please "
    });
  }

  const callcustomer = new CallCustomer({
    name: req.body.name,
    password: req.body.password,
    expo_token: req.body.expo_token
  });

  CallCustomer.create(callcustomer, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occured while creating callcustomer."
      });
    } else {
      res.send(data);
    }
  });
};

exports.findAll = (req, res) => {
  CallCustomer.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving callcustomer"
      });
    } else {
      res.send(data);
    }
  });
};

exports.findOne = (req, res) => {
  CallCustomer.findByUserInfo(
    req.params.name,
    req.params.password,
    req.params.expo_token,
    (err, data) => {
      if (err) {
        if (err.kind == "not_found") {
          res.status(404).send({
            message: `Not found callcustomer with name ${req.params.name}, password ${req.params.password}, expo_token ${req.params.expo_token}`
          });
        } else {
          res.status(500).send({
            message:
              "Error retrieving callcustomer with name " + req.params.name
          });
        }
      } else {
        res.send(data);
      }
    }
  );
};

exports.delete = (req, res) => {
  CallCustomer.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found callcustomer with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete callcustomer with id " + req.params.id
        });
      }
    } else res.send({ message: `Callcustomer was deleted successfully!` });
  });
};

// exports.deleteAll = (req, res) => {
//   CallCustomer.removeAll(req.body.owner_id, (err, data) => {
//     if (err) {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while removing all callcustomers"
//       });
//     } else {
//       res.send({
//         message: `All callcustomers were deleted successfully`
//       });
//     }
//   });
// };
