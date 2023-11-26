"use strict";
const { BangDia, QLBD } = require("../models/bangDia.model");

class BangDiaCtrl {
  index(req, res) {
    res.locals.deleted = req.query.deleted;
    const tenBangDia = req.query.tenBangDia;
    QLBD.getAll(tenBangDia, (err, data) => {
      if (err) res.redirect("/500");
      else res.render("bangDia/index", { bangDias: data });
    });
  }

  showFormCreate(req, res) {
    res.locals.status = req.query.status;
    res.render("bangDia/create");
  }

  create(req, res) {
    if (!req.body) {
      res.redirect("bangDia/create?status=error");
    }
    const newBangDia = new BangDia(req.body);
    QLBD.insert(newBangDia, (err, result) => {
      if (err) res.redirect("/bangDia/create?status=error");
      else {
        console.log(result);
        res.redirect("/bangDia");
      }
    });
  }

  showFormEdit(req, res) {
    res.locals.status = req.query.status;
    QLBD.getById(req.params.id, (err, result) => {
      if (err) {
        if (err.kind === "not_found") {
          res.redirect("/404");
        } else {
          res.redirect("/500");
        }
      } else res.render("bangDia/edit", { bangDia: result });
    });
  }

  update(req, res) {
    const newBangDia = new BangDia(req.body);
    QLBD.update(req.params.id, newBangDia, (err, result) => {
      if (err) {
        if (err.kind === "not_found") {
          res.redirect("/404");
        } else {
          res.redirect("/500");
        }
      } else {
        res.redirect("/bangDia");
      }
    });
  }

  delete(req, res) {
    QLBD.delete(req.params.id, (err, result) => {
      if (err) {
        if (err.kind === "not_found") {
          res.redirect("/404");
        } else {
          res.redirect("/500");
        }
      } else res.redirect("/bangDia?deleted=true");
    });
  }
}

module.exports = new BangDiaCtrl();
