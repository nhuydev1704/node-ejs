'use strict';
const { BangDia, QLBD } = require('../models/bangDia.model');
const { QLTN, TinNhan } = require('../models/tin-nhan.modal');
const { User, QLUser } = require('../models/user.model');

class TinNhanCtrl {
    index(req, res) {
        res.locals.deleted = req.query.deleted;
        const content = req.query.content;
        QLTN.getAll(content, (err, data) => {
            console.log('🚀 ~ file: tin-nhan.controller.js:13 ~ TinNhanCtrl ~ QLTN.getAll ~ data:', data);
            if (err) res.redirect('/500');
            else res.render('tin-nhan/index', { data });
        });
    }

    taoTin(req, res) {
        QLUser.getAll(req, (err, data) => {
            if (err) res.redirect('/500');
            else res.render('tin-nhan/create', { data });
        });
    }

    detail(req, res) {
        QLUser.getAll(req, (err, data) => {
            if (err) res.redirect('/500');
            else res.render('tin-nhan/detail', { data });
        });
    }

    showFormCreate(req, res) {
        res.locals.status = req.query.status;
        res.render('bangDia/create');
    }

    create(req, res) {
        console.log('🚀 ~ file: tin-nhan.controller.js:34 ~ TinNhanCtrl ~ create ~ req.body:', req.body);
        const newTinNhan = new TinNhan(req.body);
        QLTN.insert(newTinNhan, (err, result) => {
            console.log(result);
            res.redirect('/tin-nhan');
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
        QLBD.delete(req.params.id, (err, result) => {
            if (err) {
                if (err.kind === 'not_found') {
                    res.redirect('/404');
                } else {
                    res.redirect('/500');
                }
            } else res.redirect('/bangDia?deleted=true');
        });
    }
}

module.exports = new TinNhanCtrl();
