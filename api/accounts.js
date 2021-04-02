const { raw } = require("knex");
const { Router } = require("express");
const { encrypt, decrypt } = require("../../shared/encrypt");
const { Account } = require("../models/models");

const router = Router();

router.get('/list', (req, res) => {
    let knex = req.app.get('knex');

    let masterPass = decrypt(req.user['pKey']);

    knex("accounts")
        .select("accountId", "categories.category", "email", "username", "lastUsed")
        .where({
            'accounts.ownerId': req.user.userId
        })
        .leftJoin("categories", {'categories.categoryId' : 'accounts.categoryId'})
        .then((accounts) => {
            /*accounts.forEach((acc) => {
                acc.password = decrypt(acc.password, masterPass);
            });*/

            res.json(accounts);
        });
});

router.route('/:accountId')
    .get((req, res) => {
        let accountId = parseInt(req.params['accountId']);
        let knex = req.app.get('knex');

        let masterPass = decrypt(req.user['pKey']);

        if (!isNaN(accountId)) {
            knex("accounts")
                .where({accountId: accountId, ownerId: req.user.userId})
                .first()
                .then((result) => {
                    if (result) {

                        result.password = decrypt(result.password, masterPass);

                        res.json(result);
                    } else {
                        res.sendStatus(404);
                    }
                })
                .catch((err) => {
                    res.sendStatus(500);
                })
        } else {
            res.sendStatus(404);
        }
    })
    .post((req, res) => {
        let knex = req.app.get('knex');

        let acc = new Account(req.body);

        let masterPass = decrypt(req.user['pKey']);

        knex("accounts")
            .insert({
                email: acc.email,
                username: acc.username,
                password: encrypt(acc.password, masterPass),
                ownerId: req.user.userId
            })
            .returning("accountId")
            .then((ids) => {
                if (ids.length < 1) {
                    res.sendStatus(500);
                } else {
                    acc.accountId = ids[0];

                    res.json(acc);
                }
            });
    })
    .put((req, res) => {
        let knex = req.app.get('knex');

        let accountId = parseInt(req.params['accountId']);
        let masterPass = decrypt(req.user['pKey']);

        if (!isNaN(accountId)) {
            let acc = new Account(req.body);

            knex("accounts")
                .update({
                    username: acc.username,
                    email: acc.email,
                    password: encrypt(acc.password, masterPass),
                    lastChanged: raw("CURRENT_TIMESTAMP"),
                    categoryId: acc.categoryId
                })
                .where({
                    accountId: accountId,
                    ownerId: req.user.userId
                })
                .then(() => {
                    res.sendStatus(204);
                });
        } else {
            res.sendStatus(400);
        }
    })
    .delete((req, res) => {
        let knex = req.app.get('knex');

        let accountId = parseInt(req.params['accountId']);

        if (!isNaN(accountId)) {
            knex("accounts")
                .where({
                    accountId: accountId,
                    ownerId: req.user.userId
                })
                .del()
                .then(() => {
                    res.sendStatus(204);
                })
        } else {
            res.sendStatus(400);
        }
    })

module.exports = router;
