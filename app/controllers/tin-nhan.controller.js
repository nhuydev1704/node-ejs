'use strict';
const { BangDia, QLBD } = require('../models/bangDia.model');
const { QLTN, TinNhan } = require('../models/tin-nhan.modal');
const { User, QLUser } = require('../models/user.model');

class TinNhanCtrl {
    index(req, res) {
        res.locals.deleted = req.query.deleted;
        const content = req.query.content;
        QLTN.getAllPaging('', req, (err, dataFilter) => {
            QLTN.getAll(content, req, (err, data) => {
                if (err) res.redirect('/500');
                else
                    res.render('tin-nhan/index', {
                        data,
                        dataFilter: dataFilter.data,
                        count: dataFilter.count,
                        page: req.query.page || 1,
                        user: JSON.parse(req.cookies.user),
                    });
            });
        });
    }
    viewSend(req, res) {
        QLTN.getAll('', req, (err, dataAll) => {
            QLTN.getAllSend('', req, (err, data) => {
                console.log('🚀 ~ file: tin-nhan.controller.js:22 ~ TinNhanCtrl ~ QLTN.getAllSend ~ data:', data);
                if (err) res.redirect('/500');
                else
                    res.render('tin-nhan/send', {
                        data: data.data,
                        dataAll,
                        count: data.count,
                        page: req.query.page || 1,
                        user: JSON.parse(req.cookies.user),
                    });
            });
        });
    }

    taoTin(req, res) {
        QLUser.getAll(req, (err, data) => {
            if (err) res.redirect('/500');
            else
                res.render('tin-nhan/create', {
                    data,
                    user: JSON.parse(req.cookies.user),
                });
        });
    }

    detail(req, res) {
        const messageId = req.query.id; // Extract id from the query string

        QLTN.getById(messageId, (err, result) => {
            QLTN.getAll('', req, (err, data) => {
                if (err) res.redirect('/500');
                else
                    res.render('tin-nhan/detail', {
                        data,
                        detail: result,
                        user: JSON.parse(req.cookies.user),
                    });
            });
        });
    }

    showFormCreate(req, res) {
        res.locals.status = req.query.status;
        res.render('bangDia/create');
    }

    create(req, res) {
        console.log('🚀 ~ file: tin-nhan.controller.js:34 ~ TinNhanCtrl ~ create ~ req.body:', req.body);
        // Lưu file nếu có
        const file = req.file;
        const filePath = file ? file.path : null;

        const newTinNhan = new TinNhan({
            ...req.body,
            created_by: JSON.parse(req.cookies.user).id,
            file: filePath,
        });
        QLTN.insert(newTinNhan, (err, result) => {
            console.log(result);
            res.redirect('/tin-nhan/tin-gui');
        });
    }

    showFormEdit(req, res) {
        res.locals.status = req.query.status;
        QLBD.getById(req.params.id, (err, result) => {
            if (err) {
                if (err.kind === 'not_found') {
                    res.redirect('/404');
                } else {
                    res.redirect('/500');
                }
            } else res.render('bangDia/edit', { bangDia: result });
        });
    }

    update(req, res) {
        const newBangDia = new BangDia(req.body);
        QLBD.update(req.params.id, newBangDia, (err, result) => {
            if (err) {
                if (err.kind === 'not_found') {
                    res.redirect('/404');
                } else {
                    res.redirect('/500');
                }
            } else {
                res.redirect('/bangDia');
            }
        });
    }

    delete(req, res) {
        console.log('🚀 ~ file: tin-nhan.controller.js:120 ~ TinNhanCtrl ~ delete ~ req:', req.body);

        QLTN.delete(req.body.messageIds, req, (err, result) => {
            if (err) {
                if (err.kind === 'not_found') {
                    res.redirect('/404');
                } else {
                    res.redirect('/500');
                }
            } else
                res.send({
                    message: 'ok',
                    status: true,
                });
        });
    }
}

module.exports = new TinNhanCtrl();
