"use strict";
const sql = require("./db");

class BangDia {
  constructor(bangDia) {
    this.tenBangDia = bangDia?.tenBangDia;
    this.theLoai = bangDia?.theLoai;
    this.nhaSX = bangDia?.nhaSX;
    this.noiDung = bangDia?.noiDung;
    this.gia = bangDia?.gia;
  }
}

class QLBD {
  static insert(bangDia, callback) {
    console.log(
      "🚀 ~ file: bangDia.model.js:17 ~ QLBD ~ insert ~ bangDia:",
      bangDia
    );
    sql.query("INSERT INTO bangdia SET ?", bangDia, (err, res) => {
      if (err) {
        console.log("err", err);
        callback(err, null);
        return;
      }
      console.log("inserted:", { id: res.insertId });
      callback(null, {
        id: res.insertId,
        ...bangDia,
      });
    });
  }

  static getById(id, callback) {
    sql.query(`SELECT * FROM bangdia WHERE id = ${id}`, (err, res) => {
      if (err) {
        console.log("err", err);
        callback(err, null);
        return;
      }
      if (res.length) {
        console.log("found: ", res[0]);
        callback(null, res[0]);
        return;
      }
      // not found with the id
      callback({ kind: "not_found" }, null);
    });
  }

  static getAll(tenBangDia, callback) {
    let query = "SELECT * FROM bangdia";
    if (tenBangDia) {
      query += ` WHERE tenBangDia LIKE '%${tenBangDia}%'`;
    } // nếu có truyền vào tên băng đĩa thì sẽ tìm kiếm theo tên

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        callback(null, err);
        return;
      }
      console.log("bangDia: ", res);
      callback(null, res);
    });
  }

  static update(id, bangDia, callback) {
    sql.query(
      "UPDATE bangdia SET ? WHERE id = ?",
      [bangDia, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          callback(null, err);
          return;
        }
        if (res.affectedRows == 0) {
          // not found  with the id
          callback({ kind: "not_found" }, null);
          return;
        }
        console.log("updated : ", { id: id, ...bangDia });
        callback(null, { id: id, ...bangDia });
      }
    );
  }

  static delete(id, callback) {
    sql.query("DELETE FROM bangdia WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        callback(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found with the id
        callback({ kind: "not_found" }, null);
        return;
      }
      console.log("deleted with id: ", id);
      callback(null, res);
    });
  }
}

module.exports = { BangDia, QLBD };
