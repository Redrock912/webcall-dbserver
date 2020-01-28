module.exports = app => {
  const owner = require("../controllers/ownercontroller");
  const callcustomer = require("../controllers/callcustomercontroller");

  app.post("/owner", owner.create);
  app.get("/owner", owner.findAll);
  app.get("/owner/:name/:password", owner.findOne);
  app.put("/owner/", owner.update);
  app.delete("/owner/:id", owner.delete);
  app.delete("/owner", owner.deleteAll);

  app.post("/owner/:id", owner.orderRecieved);
  app.post("/orderComplete/", owner.orderComplete);

  app.post("/callcustomer", callcustomer.create);
  app.put("/callcustomer", callcustomer.update);
  app.get("/callcustomer", callcustomer.findAll);
  app.get("/callcustomer/:name/:password/:expo_token", callcustomer.findOne);
  app.delete("/callcustomer/:id", callcustomer.delete);

  //app.post("/owner/:id", owner.sendInfo);

  app.post("/orderConfirmed/", callcustomer.orderConfirmed);

  //app.delete("/callcustomer/:owner_id", callcustomer.deleteAll);
};
