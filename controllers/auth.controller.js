const config = require("../config/auth.config");
var connection = require('../connection.js');
var db = connection.getDb();

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = {
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    firstname: req.body.firstname,
    lastname: req.body.lastname
  };

  db.collection('users').insertOne(user);
};

exports.signin = async (req, res) => {
    try {
        const user = await db.collection('users').findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }
        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
    
        if (!passwordIsValid) {
            return res.status(401).send({
              accessToken: null,
              message: "Invalid Password!"
            });
        }

        var token = jwt.sign({ id: user._id }, config.secret);

        res.status(200).send({
            id: user._id,
            email: user.email,
            roles: user.roles,
            accessToken: token
        })
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};