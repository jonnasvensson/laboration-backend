const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectId = mongo.ObjectID;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name 
const dbName = process.env.DB_NAME || 'DBlabb';

// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });
client.connect();

module.exports = {
    getclient: function() {
        return client;
    },
    getDB: function() {
        let client = module.exports.getclient();
        let db = client.db(dbName);
        return db;
    },
    createObjectId(id) {
        return new ObjectId(id);
    }
};