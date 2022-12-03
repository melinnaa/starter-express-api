const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
var connection = require('../connection.js');
var db = connection.getDb();
var bcrypt = require("bcryptjs");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  var ObjectId = require('mongodb').ObjectId;

  app.get("/user", [authJwt.verifyToken], controller.userBoard);

  app.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);

  app.put('/user', [authJwt.verifyToken], async (req, res) => {
      try {
          let user_id = req.body._id;
          let user = req.body;
          user.password = bcrypt.hashSync(user.password, 8);
          delete user._id;

          db.collection('users').findOneAndUpdate(
              { _id: new ObjectId(user_id) },
              { $set: user },
              { 
                  upsert: true ,
                  returnDocument : 'after',
                  returnOriginal: false
              },
              function (error, result) {
                  if (error) console.log(error);
                  else res.send(result)
              }
          );
      }
      catch (err) {
          console.log(err);
          throw err;
      }
  });
};