const fs = require("fs");
const { encrypt, decrypt } = require("../shared/encrypt");

let _config;

function _load() {
    // If a JSON configuration exists...
    if (fs.existsSync("./config.json")) {
        // Load it.
        let data = fs.readFileSync("./config.json");
        let jsonD = data.toString();

        // Deserialize.
        _config = JSON.parse(jsonD);

        // Encrypt it and dispose of original JSON.
        fs.writeFileSync("./config.dec", encrypt(jsonD));
        fs.rmSync("./config.json");
    }
    // else, if encrypted configuration file exists, decrypt it and load it.
    else if (fs.existsSync("./config.dec")) {
        let data = fs.readFileSync("./config.dec");
        let jsonD = decrypt(data.toString());

        _config = JSON.parse(jsonD);
    }
}

module.exports = function() {
    _load();
    console.log("app config load/decryption successful!");
    console.log(_config);
    return _config;
};
