const { Router } = require("express");

const { Category } = require("../models/models");

const router = Router();

router.get('/list', (req, res) => {
    let knex = req.app.get('knex');

    knex("categories")
        .where({
            ownerId: req.user.userId
        })
        .then((categories) => {
            res.json(categories);
        });
});

router.get('/summary', (req, res) => {
    let knex = req.app.get('knex');

    knex("accounts")
        .select("accountId", "accounts.categoryId", "categories.category", "email", "username", "lastChanged", "lastUsed")
        .leftJoin("categories", {'accounts.categoryId' : 'categories.categoryId'})
        .where({'accounts.ownerId': req.user.userId})
        .then((accounts) => {
            let passMap = {};
            passMap["None"] = [];

            accounts.forEach((account) => {
                if (account.category) {
                    if (passMap[account.category]) {
                        passMap[account.category].push(account);
                    } else {
                        passMap[account.category] = [account];
                    }
                } else {
                    passMap["None"].push(account);
                }

                delete account.categoryId;
                delete account.category;
            });

            res.json(passMap);
        });
})

router.get('/:categoryId/accounts', (req, res) => {
    let knex = req.app.get('knex');

    let categoryId = parseInt(req.params['categoryId']);

    if (!isNaN(categoryId)) {
        let query = knex("accounts")
            .select("accountId", "email", "username", "lastUsed", "lastChanged");

        if (categoryId > 0) {
            query.where({
                categoryId: categoryId
            })
        } else {
            query.whereRaw("\"accounts\".\"categoryId\" IS null")
        }

        query.then((accs) => {
            res.json(accs);
        });
    } else {
        res.status(400).send("CategoryID not specified or invalid.");
    }
})

router.route('/:categoryId')
    .get((req, res) => {
        let categoryId = parseInt(req.params['categoryId']);
        let knex = req.app.get('knex');

        if (!isNaN(categoryId)) {
            knex("categories")
                .where({categoryId: categoryId, ownerId: req.user.userId})
                .first()
                .then((result) => {
                    if (result) {
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

        let cat = new Category(req.body);

        knex("categories")
            .insert({
                category: cat.category,
                ownerId: req.user.userId
            })
            .returning("categoryId")
            .then((ids) => {
                if (ids.length < 1) {
                    res.sendStatus(500);
                } else {
                    cat.categoryId = ids[0];

                    res.json(cat);
                }
            });
    })
    .put((req, res) => {
        let knex = req.app.get('knex');

        let categoryId = parseInt(req.params['categoryId']);

        if (!isNaN(categoryId)) {
            let cat = new Category(req.body);

            knex("categories")
                .update({
                    category: cat.category
                })
                .where({
                    categoryId: cat.categoryId,
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

        let categoryId = parseInt(req.params['categoryId']);

        if (!isNaN(categoryId)) {
            knex("categories")
                .where({
                    categoryId: categoryId,
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
