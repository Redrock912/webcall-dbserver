module.exports = app => {
  const owner = require("../controllers/webcallcontroller");

  app.post("/owner", owner.create);

  app.get("/owner", owner.findAll);

  app.get("/owner/:name/:password", owner.findOne);

  app.put("/owner/:id", owner.update);

  app.delete("/owner/:id", owner.delete);

  app.delete("/owner", owner.deleteAll);
};
