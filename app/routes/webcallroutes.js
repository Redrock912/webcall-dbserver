module.exports = app => {
  const owner = require("../controllers/ownercontroller");
  const callcustomer = require("../controllers/callcustomercontroller");

  app.post("/owner", owner.create);

  app.get("/owner", owner.findAll);

  app.get("/owner/:name/:password", owner.findOne);

  app.put("/owner/:id", owner.update);

  app.delete("/owner/:id", owner.delete);

  app.delete("/owner", owner.deleteAll);

  app.post("/callcustomer", callcustomer.create);
  app.get("/callcustomer", callcustomer.findAll);
  app.get("/callcustomer/:name/:password/:expo_token", callcustomer.findOne);
  app.delete("/callcustomer/:id", callcustomer.delete);
  //app.delete("/callcustomer/:owner_id", callcustomer.deleteAll);
};
