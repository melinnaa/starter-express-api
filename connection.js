/**
 * Import MongoClient & connection to DB
 */
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://Melinna_agdl:3p424OAtmDNCT1Zj@cluster0.rd11o.mongodb.net/managByMe?retryWrites=true&w=majority';
const dbName = 'managByMe';
var db;
let users;
let customers;
let consultations;
let roles = ["user", "admin"];

module.exports = {
    connectToServer: function (callback) { 
        MongoClient.connect(url, function(err, client) {
            console.log("Connected successfully to server");
            db = client.db(dbName);
            users = db.collection('users');
            customers = db.collection('customers');
            consultations = db.collection('consultations');
            return callback(err);
        });
    },

    getDb: function() {
        return db;
    },

    getRoles: function() {
        return roles;
    }
}
