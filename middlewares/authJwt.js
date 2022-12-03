const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
var connection = require('../connection.js');
var db = connection.getDb();
//var roles = connection.getRoles();

var ObjectId = require('mongodb').ObjectId;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = async (req, res, next) => {
  try {
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.userId) });
    if (!user) {
      res.status(500).send({ message: 'erreur' });
      return;
    }

    if (user.roles.includes('admin')) {
      next();
      return;
    }
    
    res.status(403).send({ message: "Require Admin Role!" });
    return;
  }
  catch(err) {
    console.log(err);
    throw err;
  }
}

const authJwt = {
  verifyToken,
  isAdmin
};
module.exports = authJwt;