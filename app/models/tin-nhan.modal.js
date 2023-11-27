"use strict";
const sql = require("./db");

class TinNhan {
  constructor(message) {
    this.user_id = message?.user_id;
    this.content = message?.content;
    this.file = message?.file;
    this.is_read = message?.is_read;
    this.title = message?.title;
  }
}

class QLTN {
  static insert(tinNhan, callback) {
    console.log(
      "🚀 ~ file: tin-nhan.modal.js:16 ~ QLTN ~ insert ~ tinNhan:",
      tinNhan
    );
    sql.query(
      "INSERT INTO message SET ?",
      {
        ...tinNhan,
        title: tinNhan?.title ? tinNhan.title : "(Không có chủ đề)",
      },
      (err, res) => {
        if (err) {
          console.log("err", err);
          callback(err, null);
          return;
        }
        console.log("inserted:", { id: res.insertId });
        callback(null, {
          id: res.insertId,
          ...tinNhan,
        });
      }
    );
  }

  static getById(id, callback) {
    sql.query(
      `SELECT message.*, users.*
    FROM message
    JOIN users ON message.user_id = users.id
    WHERE message.id = ${id};`,
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

  static getAll(content, callback) {
    let query =
      "SELECT message.*, users.*, DATE_FORMAT(message.created_at, '%H:%i %d/%m/%Y') AS formatted_created_at FROM message LEFT JOIN users ON message.user_id = users.id ORDER BY message.created_at DESC;";
    if (content) {
      query += ` WHERE content LIKE '%${content}%'`;
    } // nếu có truyền vào tên băng đĩa thì sẽ tìm kiếm theo tên

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        callback(null, err);
        return;
      }
      console.log("message: ", res);
      callback(null, res);
    });
  }

  static update(id, tinNhan, callback) {
    sql.query(
      "UPDATE message SET ? WHERE id = ?",
      [tinNhan, id],
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
        console.log("updated : ", { id: id, ...tinNhan });
        callback(null, { id: id, ...tinNhan });
      }
    );
  }

  static delete(id, callback) {
    sql.query("DELETE FROM message WHERE id = ?", id, (err, res) => {
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

module.exports = { TinNhan, QLTN };
