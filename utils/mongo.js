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
        db.close();
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
        db.close();
        callback(err);
      }
    });
  },
  updateOne: function (collection, filter, update, callback) {
    mongoClient.connect(config.mongoUri, function (err, db) {
      if (!err) {
        db.collection(collection).updateOne(filter, update, callback);
        db.close();
      } else {
        db.close();
        callback(err)
      }
    });
  }
};

module.exports = exports;