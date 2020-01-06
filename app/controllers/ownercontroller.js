const Owner = require("../models/owner.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content is empty right now. Fill in please "
    });
  }

  const owner = new Owner({
    name: req.body.name,
    password: req.body.password
  });

  Owner.create(owner, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occured while creating owner."
      });
    } else {
      res.send(data);
    }
  });
};

exports.findAll = (req, res) => {
  Owner.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving owner"
      });
    } else {
      res.send(data);
    }
  });
};

exports.findOne = (req, res) => {
  Owner.findByUserInfo(req.params.name, req.params.password, (err, data) => {
    if (err) {
      if (err.kind == "not_found") {
        res.status(404).send({
          message: `Not found owner with name ${req.params.name}, password ${req.params.password}`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving owner with name " + req.params.name
        });
      }
    } else {
      res.send(data);
    }
  });
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Owner.updateById(req.params.id, new Owner(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found owner with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error updating owner with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

exports.delete = (req, res) => {
  Owner.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found owner with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete owner with id " + req.params.id
        });
      }
    } else res.send({ message: `Owner was deleted successfully!` });
  });
};

exports.deleteAll = (req, res) => {
  Owner.removeAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Owner"
      });
    } else {
      res.send({
        message: `All owners were deleted successfully`
      });
    }
  });
};

exports.orderConfirmed = (req, res) => {
  Owner.orderConfirmed(req.body.number, req.body.expo_token, err => {
    if (err) {
      res.status(500).send({
        message: "Error occurred while sending order Confirmation"
      });
    } else {
      res.send({
        message: "Order Confirm notification sent successfully"
      });
    }
  });
};

exports.orderComplete = (req, res) => {
  Owner.orderComplete(req.body.number, req.body.expo_token, err => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while sending order notification"
      });
    } else {
      res.send({
        message: "order number sent successfully"
      });
    }
  });
};
