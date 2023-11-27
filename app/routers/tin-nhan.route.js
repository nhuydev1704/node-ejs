const router = require("express").Router();
const TinNhanCtrl = require("../controllers/tin-nhan.controller");
const { checkSession, checkNotSession } = require("../utils");

module.exports = (app) => {
  router.get("/", checkNotSession, TinNhanCtrl.index);
  router.get("/tao-tin", TinNhanCtrl.taoTin);
  router.post("/tao-tin", TinNhanCtrl.create);
  router.get("/chi-tiet", TinNhanCtrl.detail);
  router.get("/tin-gui", TinNhanCtrl.viewSend);
  router.post("/delete", TinNhanCtrl.delete);

  app.use("/tin-nhan", router);
};
