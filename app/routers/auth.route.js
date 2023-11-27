const router = require("express").Router();
const AuthCtrl = require("../controllers/auth.controller");
const { checkSession } = require("../utils");

module.exports = (app) => {
  router.get("/register", checkSession, AuthCtrl.index);
  router.post("/register", AuthCtrl.register);
  router.post("/login", AuthCtrl.login);
  router.get("/logout", AuthCtrl.logout);

  app.use("/", router);
};
