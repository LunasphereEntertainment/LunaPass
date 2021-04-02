const config = require("./config")();
const knex = require("knex")(config.db);
const { join } = require("path");
const { json } = require("body-parser");
const cors = require("cors");

const app = require("express")();
app.set('knex', knex);
app.set('config', config);

app.use(json())
if (process.env.DEV) {
    console.log("dev mode active - enabling cors");
    app.use(cors());
}
app.use('/api', require("./api/api"));

app.use((req, res) => {
    res.status(400).sendFile(join(__dirname, "/static/error.html"));
});

app.listen(3000, () => {
    console.log("LunaPass Server Started 0.0.0.0:3000");
});
