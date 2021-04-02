const jwt = require("jsonwebtoken");
const eJwt = require("express-jwt")
const { Router } = require("express");

const router = Router();

function _getSecret(req, payload, done) {
    const config = req.app.get('config');
    done(null, config['security']['secret']);
}

router.get('/token', (req, res) => {
    const config = req.app.get('config');

    let token = jwt.sign({userId: 1}, config['security']['secret']);
    res.json({
        token: token
    });
})

router.use(eJwt({secret: _getSecret, algorithms: ['HS256']}));
router.use('/categories', require("./categories"));
router.use('/accounts', require("./accounts"));

module.exports = router;
