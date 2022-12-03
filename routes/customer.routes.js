const { authJwt } = require("../middlewares");
var connection = require('../connection.js');
var db = connection.getDb();

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    var ObjectId = require('mongodb').ObjectId;
  
    app.get('/customers', [authJwt.verifyToken], async (req, res) => {
        try {
            const findResult = await db.collection('customers').find({user_id: new ObjectId(req.userId)},{ sort:[['lastname']]}).toArray();
            res.send(findResult);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    });

    app.get('/customer/:id', [authJwt.verifyToken], async (req, res) => {
        try {
            const id = req.params.id;
            const customer = await db.collection('customers').findOne({ _id: new ObjectId(id), user_id: new ObjectId(req.userId) });
            res.send(customer);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    });

    app.put('/customer', [authJwt.verifyToken], async (req, res) => {
        try {
            let customer_id = req.body._id;
            let customer = req.body;

            customer.user_id = new ObjectId(req.userId);
            delete customer._id;

            db.collection('customers').findOneAndUpdate(
                { _id: new ObjectId(customer_id), user_id: new ObjectId(req.userId)},
                { $set: customer },
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

    app.delete('/customer/:id', [authJwt.verifyToken], async (req, res) => {
        try {
            const id = req.params.id;
            await db.collection('customers').deleteOne({ _id: new ObjectId(id)});
            res.sendStatus(200);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    })
  };