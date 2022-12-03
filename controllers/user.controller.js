var connection = require('../connection.js');
var db = connection.getDb();

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

exports.adminBoard = async (req, res) => {
    try {
        const users = await db.collection('users').find().toArray();
        if (!users) {
            return res.status(404).send({ message: "Not users found" });
        }
        res.send(users);
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};