const Owner = require("../models/owner.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content is empty right now. Fill in please "
    });
  }

  const owner = new Owner({
    name: req.body.name,
    expo_token: req.body.expo_token
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
  Owner.findByUserInfo(req.params.id, (err, data) => {
    if (err) {
      if (err.kind == "not_found") {
        res.status(404).send({
          message: `Not found owner with id ${req.params.id}`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving owner with id " + req.params.id
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

  Owner.update(req.body.name, req.body.expo_token, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: "Not found name"
        });
      } else {
        res.status(500).send({
          message: "Error updating name"
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

exports.orderRecieved = (req, res) => {
  Owner.orderRecieved(req.body, req.params.id, (error, result) => {
    if (error) {
      res.status(404).send({
        message: `Not found owner with id ${req.params.id}`
      });
    } else {
      res.send({ message: `Owner ${req.params.id} just recieved order` });
    }
  });

  // (req, res) => {
  //   Owner.orderRecieved(req.body.number, req.body.expo_token, err => {
  //     if (err) {
  //       res.status(500).send({
  //         message: "Error occurred while sending order Confirmation"
  //       });
  //     } else {
  //       res.send({
  //         message: "Order Confirm notification sent successfully"
  //       });
  //     }
  //   });
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
