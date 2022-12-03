var connection = require('../connection.js');
var db = connection.getDb();

checkDuplicateEmail = async (req, res, next) => {
    try {
        const user = await db.collection('users').findOne({ email: req.body.email });
        if (user) {
            res.status(400).send({ message: "Failed! Email is already in use!" });
            return;
        }
    }
    catch (err) {
        console.log(err);
        throw err;
    }
    next();
};

const verifySignUp = {
  checkDuplicateEmail
};

module.exports = verifySignUp;