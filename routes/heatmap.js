var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

/* GET users 
listing. */
router.get('/listheatpoints', function(req, res, next) {
  const {userid} = req.query;
  const mongoDB = 'mongodb://127.0.0.1:27017/';
  MongoClient.connect(mongoDB, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    const dbo = db.db("mcog");
    dbo.collection("devicedump").find({userid}).toArray(function(err, result) {
        if (err) throw err;
        const tmp = result.filter((r)=>{
          return r.Location !== undefined;
        }).map((r)=>r.Location);
        const rtn = [].concat.apply([], tmp).map((item)=>{
          const arr = item.split(',').map(t=>Number(t));
          return [arr[1], arr[2]];
        })
        res.json(rtn);
        db.close();
    });
  });
});

router.get('/listmarkers', function(req, res, next) {
  const {userId} = req.query;
  const mongoDB = 'mongodb://127.0.0.1:27017/';
  MongoClient.connect(mongoDB, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    const dbo = db.db("mcog");
    dbo.collection("heatmapmarkers").find({userId}).toArray(function(err, result) {
        if (err) throw err;
        res.json(result);
        db.close();
    });
  });
});

router.post('/addmarker', function(req, res, next) {
  const {lat, lng, name, userId} = req.body;
  if(!userId) {
    res.send('bad');
    return;
  };
  const mongoDB = 'mongodb://127.0.0.1:27017/';
  MongoClient.connect(mongoDB, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    const dbo = db.db("mcog");
    var myobj = {lat, lng, name, userId};
    dbo.collection("heatmapmarkers").insertOne(myobj, function(err, result) {
        if (err) throw err;
        res.send('success');
        db.close();
    });
  });
});

router.post('/removemarker', function(req, res, next) {
  const {_id} = req.body;
  const mongoDB = 'mongodb://127.0.0.1:27017/';
  MongoClient.connect(mongoDB, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    const dbo = db.db("mcog");
    var whereStr = {_id: ObjectId(_id)};
    dbo.collection("heatmapmarkers").deleteOne(whereStr, function(err, obj) {
        if (err) throw err;
        res.send('success');
        db.close();
    });
  });
});


module.exports = router;
