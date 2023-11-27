"use strict";
const { BangDia, QLBD } = require("../models/bangDia.model");
const { User, QLUser } = require("../models/user.model");

class AuthCtrl {
  index(req, res) {
    res.locals.deleted = req.query.deleted;
    const tenBangDia = req.query.tenBangDia;
    // QLBD.getAll(tenBangDia, (err, data) => {
    //   if (err) res.redirect("/500");
    //   else res.render("register");
    // });
    res.render("register");
  }

  login(req, res) {
    // Kiểm tra nếu đã đăng nhập
    if (req?.cookies?.user) {
      return res.redirect("/tin-nhan");
    }

    // Kiểm tra phương thức POST để xử lý việc đăng nhập
    if (req.method === "POST") {
      const { email, password } = req.body;
      console.log(
        "🚀 ~ file: auth.controller.js:25 ~ AuthCtrl ~ login ~ req.body:",
        req.body
      );

      // Gọi hàm kiểm tra đăng nhập từ model hoặc service
      QLUser.checkLogin(email, password, (err, user) => {
        if (err) {
          console.error(err);
          return res.send({
            status: false,
          });
        }

        if (user) {
          // Đăng nhập thành công, lưu thông tin người dùng vào phiên
          // req.session.user = user;
          res.cookie("user", JSON.stringify(user), { maxAge: 360000000 }); // Set the expiration time as needed

          return res.send({
            status: true,
          });
        } else {
          // Đăng nhập thất bại, hiển thị thông báo hoặc chuyển hướng
          return res.send({
            status: false,
          });
        }
      });
    } else {
      // Hiển thị trang đăng nhập
      res.render("login");
    }
  }
  logout(req, res) {
    // Xóa thông tin người dùng khỏi phiên
    res.cookie("user", "", { expires: new Date(0) });

    console.log(
      "🚀 ~ file: auth.controller.js:62 ~ AuthCtrl ~ logout ~ req.cookies.user:",
      req.cookies.user
    );

    // Chuyển hướng về trang đăng nhập
    return res.send({
      status: true,
    });
  }

  register(req, res) {
    const { fullName, email, password, confirmPassword } = req.body;
    console.log(
      "🚀 ~ file: auth.controller.js:27 ~ AuthCtrl ~ register ~ req.body:",
      req.body
    );

    // Kiểm tra các trường có được điền đầy đủ không
    if (!fullName || !email || !password || !confirmPassword) {
      return res.send("Vui lòng điền đầy đủ thông tin.");
    }

    // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp nhau không
    if (password !== confirmPassword) {
      return res.send("Mật khẩu và xác nhận mật khẩu không khớp.");
    }

    // Xử lý đăng ký tài khoản (ở đây có thể lưu vào cơ sở dữ liệu)

    // Hiển thị thông báo thành công
    const newUser = new User(req.body);
    QLUser.insert(newUser, (err, result) => {
      res.send("Đăng ký thành công!");
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

module.exports = new AuthCtrl();
