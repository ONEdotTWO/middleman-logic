var config = require('../config/app-config');
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;

var exports = {
  save: function (collection, obj, callback) {
    mongoClient.connect(config.mongoUri, function (err, db) {
      if (!err) {
        db.collection(collection).insertOne(obj, function (err) {
          db.close();
          callback(err)
        });
      } else {
        callback(err);
      }
    });
  },
  findOne: function (collection, query, callback) {
    mongoClient.connect(config.mongoUri, function (err, db) {
      if (!err) {
        db.collection(collection).find(query).toArray(function (err, doc) {
          callback(err, doc[0], db);
        });
      } else {
        callback(err);
      }
    });
  },
  updateOne: function (collection, filter, update, callback) {
    mongoClient.connect(config.mongoUri, function (err, db) {
      if (!err) {
        db.collection(collection).updateOne(filter, update, function (err) {
          callback(err, db);
        });
      } else {
        console.log("unable to connect to db for updating");
        callback(err)
      }
    });
  }
};

module.exports = exports;