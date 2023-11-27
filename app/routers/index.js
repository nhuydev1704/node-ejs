module.exports = (app) => {
  require("./bangDia.route")(app);
  require("./auth.route")(app);
  require("./tin-nhan.route")(app);
};
