// Middleware để kiểm tra session
function checkSession(req, res, next) {
  // Kiểm tra xem có session.user hay không
  if (req.session.user) {
    // Nếu không có, chuyển hướng đến /tin-nhan
    return res.redirect("/tin-nhan");
  }

  // Nếu có session.user, tiếp tục xử lý route chính
  next();
}

module.exports = {
  checkSession,
};
