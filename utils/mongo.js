var config = require('../config/app-config');
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;

var exports = {
  save: function (collection, obj, callback) {
    mongoClient.connect(config.mongoUri, function (err, db) {
      if (!err) {
        db.collection(collection).insertOne(obj, callback);
      } else {
        callback(err);
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
        callback(err);
      }
    });
  },
  updateOne: function (collection, filter, update, callback) {
    mongoClient.connect(config.mongoUri, function (err, db) {
      if (!err) {
        db.collection(collection).updateOne(filter, update, callback);
      } else {
        callback(err)
      }
    });
  }
};

module.exports = exports;