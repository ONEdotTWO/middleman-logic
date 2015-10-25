var config = require('../config/app-config');
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;

var exports = {
  save: function (collection, obj, callback) {
    mongoClient.connect(config.mongoUri, function (err, db) {
      if (!err) {
        db.collection(collection).insertOne(obj, callback);
      } else {
        callback(Error("Couldn't connect to remote mongo: " + err.message));
      }
    });
  },
  findOne: function (collection, query, callback) {
    mongoClient.connect(config.mongoUri, function (err, db) {
      if (!err) {
        db.collection(collection).find(query).limit(1).toArray(function (err, doc) {
          db.close();
          callback(err, doc);
        });
      } else {
        callback(Error("Couldn't connect to remote mongo: " + err.message));
      }
    });
  }
};

module.exports = exports;