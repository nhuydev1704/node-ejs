"use strict";
const sql = require("./db");

class User {
  constructor(user) {
    this.fullName = user?.fullName;
    this.email = user?.email;
    this.password = user?.password;
    this.confirmPassword = user?.confirmPassword;
  }
}

class QLUser {
  static insert(user, callback) {
    sql.query("INSERT INTO users SET ?", user, (err, res) => {
      if (err) {
        console.log("err", err);
        callback(err, null);
        return;
      }
      console.log("inserted:", { id: res.insertId });
      callback(null, {
        id: res.insertId,
        ...user,
      });
    });
  }

  static checkLogin(email, password, callback) {
    sql.query(
      `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`,
      (err, res) => {
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
      }
    );
  }

  static getAll(req, callback) {
    let query = "SELECT * FROM users WHERE id <> ?";
    const userIdFromSession = req.session?.user?.id; // Điều này giả sử bạn đã lưu trữ userId trong session
    console.log(
      "🚀 ~ file: user.model.js:52 ~ QLUser ~ getAll ~ userIdFromSession:",
      userIdFromSession
    );

    sql.query(query, [userIdFromSession], (err, res) => {
      if (err) {
        console.log("error: ", err);
        callback(null, err);
        return;
      }
      console.log("users: ", res);
      callback(null, res);
    });
  }

  static getById(id, callback) {
    sql.query(`SELECT * FROM users WHERE id = ${id}`, (err, res) => {
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
}

module.exports = { User, QLUser };
