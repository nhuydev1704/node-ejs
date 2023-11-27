"use strict";
const sql = require("./db");

class TinNhan {
  constructor(message) {
    this.user_id = message?.user_id;
    this.content = message?.content;
    this.file = message?.file;
    this.is_read = message?.is_read;
    this.title = message?.title;
    this.created_by = message?.created_by;
    this.deleted_at = message?.deleted_at;
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
    console.log("🚀 ~ file: tin-nhan.modal.js:42 ~ QLTN ~ getById ~ id:", id);
    sql.query(
      `SELECT 
      message.id as id,
      message.title as title,
      message.content as content,
      message.created_at as created_at,
      users.id as user_id,
      users.fullName as fullName,
      users.email as email,
      created_by_user.id as created_by_user_id,
      created_by_user.fullName as created_by_user_full_name,
      created_by_user.email as created_by_user_email,
      DATE_FORMAT(message.created_at, '%H:%i %d/%m/%Y') AS formatted_created_at
  FROM 
      message
  JOIN 
      users ON message.user_id = users.id
  JOIN 
      users as created_by_user ON message.created_by = created_by_user.id
  WHERE 
      message.id = ${+id};`,
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
  // "scripts": {
  //   "test": "echo \"Error: no test specified\" && exit 1",
  //   "start": "nodemon index.js",
  //   "dbsetup": "nodemon dbsetup.js"
  // },

  static getAll(content, req, callback) {
    console.log("req?.cookies?.user", req?.cookies?.user);
    let query = `SELECT message.*, users.*, message.id as id, DATE_FORMAT(message.created_at, '%H:%i %d/%m/%Y') AS formatted_created_at, created_by_user.id as created_by_user_id,
    created_by_user.fullName as created_by_user_full_name,
    created_by_user.email as created_by_user_email
     FROM message 
      JOIN 
    users as created_by_user ON message.created_by = created_by_user.id
      JOIN users ON message.user_id = users.id where message.user_id = ${
        JSON.parse(req?.cookies?.user).id
      } and message.deleted_at is null  ORDER BY message.created_at DESC;`;
    if (content) {
      query += ` WHERE content LIKE '%${content}%'`;
    } // nếu có truyền vào tên băng đĩa thì sẽ tìm kiếm theo tên

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        callback(null, err);
        return;
      }
      callback(null, res);
    });
  }

  static getAllPaging(content, req, callback) {
    console.log("req?.cookies?.user", req?.cookies?.user);
    let query = `SELECT message.*, users.*, message.id as id, DATE_FORMAT(message.created_at, '%H:%i %d/%m/%Y') AS formatted_created_at, created_by_user.id as created_by_user_id,
    created_by_user.fullName as created_by_user_full_name,
    created_by_user.email as created_by_user_email
     FROM message 
      JOIN 
    users as created_by_user ON message.created_by = created_by_user.id
      JOIN users ON message.user_id = users.id where message.user_id = ${
        JSON.parse(req?.cookies?.user).id
      } and message.deleted_at is null `;

    const page = parseInt(req.query?.page) || 1;
    const pageSize = 5;

    const offset = (page - 1) * pageSize;

    query += ` ORDER BY message.created_at DESC LIMIT ${pageSize} OFFSET ${offset};`;

    // count
    let queryCount = `SELECT count(*) as total
     FROM message 
      JOIN 
    users as created_by_user ON message.created_by = created_by_user.id
      JOIN users ON message.user_id = users.id where message.user_id = ${
        JSON.parse(req?.cookies?.user).id
      } and message.deleted_at is null`;
    sql.query(queryCount, (err, count) => {
      if (err) {
        console.log("error: ", err);
        callback(null, err);
        return;
      }
      sql.query(query, (err, res) => {
        if (err) {
          console.log("error: ", err);
          callback(null, err);
          return;
        }
        callback(null, {
          data: res,
          count: count[0].total,
        });
      });
    });
  }

  static getAllSend(content, req, callback) {
    console.log("req?.cookies?.user", req?.cookies?.user);
    let query = `SELECT message.*, users.*, message.id as id, DATE_FORMAT(message.created_at, '%H:%i %d/%m/%Y') AS formatted_created_at, created_by_user.id as created_by_user_id,
    created_by_user.fullName as created_by_user_full_name,
    created_by_user.email as created_by_user_email
     FROM message 
      JOIN
    users as created_by_user ON message.created_by = created_by_user.id
      JOIN users ON message.user_id = users.id where message.created_by = ${
        JSON.parse(req?.cookies?.user).id
      } and message.deleted_at is null `;
    if (content) {
      query += ` WHERE content LIKE '%${content}%'`;
    } // nếu có truyền vào tên băng đĩa thì sẽ tìm kiếm theo tên

    const page = parseInt(req.query?.page) || 1;
    const pageSize = 5;

    const offset = (page - 1) * pageSize;

    query += ` ORDER BY message.created_at DESC LIMIT ${pageSize} OFFSET ${offset};`;

    // count
    let queryCount = `SELECT count(*) as total
     FROM message 
      JOIN
    users as created_by_user ON message.created_by = created_by_user.id
      JOIN users ON message.user_id = users.id where message.created_by = ${
        JSON.parse(req?.cookies?.user).id
      } and message.deleted_at is null`;

    sql.query(queryCount, (err, count) => {
      if (err) {
        console.log("error: ", err);
        callback(null, err);
        return;
      }
      sql.query(query, (err, res) => {
        if (err) {
          console.log("error: ", err);
          callback(null, err);
          return;
        }
        callback(null, {
          data: res,
          count: count[0].total,
        });
      });
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

  static delete(ids, req, callback) {
    // Construct a comma-separated string of IDs for the SQL query
    const idsString = ids.join(",");

    // Use the SQL UPDATE statement to set the `deleted_at` field to the current timestamp
    const query = `UPDATE message SET deleted_at = ${
      JSON.parse(req.cookies.user).id
    } WHERE id IN (${idsString})`;

    // Execute the query
    sql.query(query, (err, res) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        callback(err, null);
        return;
      }

      // Return the result (if needed)
      callback(null, res);
    });
  }
}

module.exports = { TinNhan, QLTN };
