const router = require("express").Router();
const bangDiaCtrl = require("../controllers/bangDia.controller");

module.exports = (app) => {
  router.get("/", bangDiaCtrl.index);
  router.get("/create", bangDiaCtrl.showFormCreate);
  router.post("/", bangDiaCtrl.create);
  router.get("/delete/:id", bangDiaCtrl.delete);
  router.put("/:id", bangDiaCtrl.update);
  router.get("/edit/:id",bangDiaCtrl.showFormEdit);

  app.use("/bangDia", router);
};
