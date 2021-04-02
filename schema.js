const config = require("./config")();
const knex = require("knex")(config.db);
/*
const deletes = [

]*/

const dels = [
    // knex.schema.dropTableIfExists('categories'),
    // knex.schema.dropTableIfExists('accounts')
    knex.raw("DROP TABLE IF EXISTS \"accounts\" CASCADE"),
    knex.raw("DROP TABLE IF EXISTS \"categories\" CASCADE"),
];

const jobs = [
    knex.schema.createTable('categories', table => {
        table.bigIncrements('categoryId').primary();

        table.integer('ownerId');
        table.string('category');
    }),

    knex.schema.createTable('accounts', table => {
        table.bigIncrements('accountId').primary();
        table.integer('ownerId');
        table.integer('categoryId').references('categories.categoryId');

        table.string('email');
        table.string('username');
        table.string('password');
        // table.string('privateKey');
        table.dateTime('lastChanged').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.dateTime('lastUsed').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    })
];

Promise.all(dels).then(() => {
    Promise.all(jobs).then(() => {
        console.log("Schema Init Successful!");
        process.exit(0);
    });
})

