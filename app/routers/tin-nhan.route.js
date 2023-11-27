const router = require("express").Router();
const TinNhanCtrl = require("../controllers/tin-nhan.controller");
const { checkSession } = require("../utils");

module.exports = (app) => {
  router.get("/", TinNhanCtrl.index);
  router.get("/tao-tin", TinNhanCtrl.taoTin);
  router.post("/tao-tin", TinNhanCtrl.create);

  app.use("/tin-nhan", router);
};
