const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = (app) => {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/signup",
        [
        verifySignUp.checkDuplicateEmail
        ],
        controller.signup
    );

    app.post('/signin', controller.signin);

};