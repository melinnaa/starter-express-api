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
        
    app.get('/consultation/:id', [authJwt.verifyToken], async (req, res) => {
        try {
            const id = req.params.id;
            const consultation = await db.collection('consultations').findOne({ _id: new ObjectId(id)});
            res.send(consultation);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    });

    app.get('/consultations/:customer_id', [authJwt.verifyToken], async (req, res) => {
        try {
            const id = req.params.customer_id;
            await db.collection('consultations').find({ customer_id: new ObjectId(id) })
            .toArray(function (err, result) {
                if (err) throw err;
                res.send(result);
            });
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    });

    app.put('/consultation', [authJwt.verifyToken], async (req, res) => {
        try {
            let consultation_id = req.body._id;
            let consultation = req.body;
            
            consultation.customer_id = new ObjectId(consultation.customer_id);
            delete consultation._id;
            
            db.collection('consultations').findOneAndUpdate(
                { _id: new ObjectId(consultation_id) },
                { $set: consultation },
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

    app.delete('/consultation/:id', [authJwt.verifyToken], async (req, res) => {
        try {
            const id = req.params.id;
            await db.collection('consultations').deleteOne({ _id: new ObjectId(id)});
            res.sendStatus(200);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    });
}