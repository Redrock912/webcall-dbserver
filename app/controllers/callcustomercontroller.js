const CallCustomer = require("../models/callcustomer.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content is empty right now. Fill in please "
    });
  }

  const callcustomer = new CallCustomer({
    name: req.body.name,
    expo_token: req.body.expo_token
  });

  CallCustomer.create(callcustomer, (err, data) => {
    if (err) {
      let errorData = {
        value: 0,
        message: "회원가입을 하는데에 문제가 발생하였습니다."
      };
      res.send(errorData);
    } else {
      res.send(data);
    }
  });
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "No data recieved. "
    });
  }

  CallCustomer.update(req.body.name, req.body.expo_token, (err, data) => {
    if (err) {
      let errorData = {
        message: "이름을 변경하는데에 문제가 발생했습니다."
      };
      console.log(err);
      res.send(errorData);
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
    req.params.expo_token,
    (err, data) => {
      if (err) {
        if (err.kind == "not_found") {
          res.status(404).send({
            message: `Not found callcustomer with name ${req.params.name},expo_token ${req.params.expo_token}`
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

exports.orderDone = (req, res) => {
  CallCustomer.orderComplete(req.body, (error, data) => {
    if (error) {
      res.status(404).send({
        message: "Not found callcustomer with token "
      });
    } else {
      res.send({ message: `Callcustomer order is done` });
    }
  });
};

exports.orderConfirmed = (req, res) => {
  CallCustomer.orderConfirmed(
    req.body.number,
    req.body.expo_token,
    (error, result) => {
      if (error) {
        res.status(404).send({
          message: "Not found callcustomer with token "
        });
      } else {
        res.send({ message: `Callcustomer order recieved` });
      }
    }
  );
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
