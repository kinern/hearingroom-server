const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* AWS DynamoDB Connection Settings */
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const client = new AWS.DynamoDB.DocumentClient();
const tableName = 'news-reader';

//Test route for server.
app.get("/", (req, res) => {
  res.json({ message: "The server is running." });
});


/*
app.get("/news-reader/all", (req, res) => {

  var params = {
    TableName: "news-reader", //"news-reader"
    Limit: 10
  };

  client.scan(params, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        var items = [];
        for (var i in data.Items)
            items.push(data.Items[i]);
        res.contentType = 'application/json';
        res.send(data);
    }
  });
});
*/


//TODO - Remove
app.get("/news-reader/people", (req, res) => {

  var params = {
    TableName: "news-reader-person", 
    Limit: 10
  };

  client.scan(params, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        var items = [];
        for (var i in data.Items)
            items.push(data.Items[i]);
        res.contentType = 'application/json';
        res.send(data);
    }
  });
});


//Scan For Basic Info On Person
app.get("/news-reader/all-people",(req, res)=> {
  const params = {        
      TableName: 'hearingroom-people',
      ExpressionAttributeNames: {
          "#f": "id",
          "#i": "name",
          "#h": "headshot",
      },
      Select: "SPECIFIC_ATTRIBUTES",
      ProjectionExpression: "#f, #i, #h",
  };
  
  client.scan(params, function(err, data) {
      if (err) {
          console.log(err, err.stack);
      } else {
          res.contentType = 'application/json';
          res.send(data);
      }
  });
});

//Details Query For Person
app.post("/news-reader/person-details", (req, res) => {
  const personId = req.body.params.id;

  const params = {    
    TableName: "hearingroom-people", 
    KeyConditionExpression: "#fn = :id",
    ExpressionAttributeNames:{
      "#fn": "id"
    },
    ExpressionAttributeValues: {
      ":id": personId
    }
  };

  client.query(params, function(err, data) {
    if (err) {
        console.log(err, err.stack);
    } else {
        res.contentType = 'application/json';
        res.send(data);
    }
  });

});


//TODO: Remove
app.post("/news-reader/clips", (req, res) => {
  const fullName = req.body.params.fullName;
  var params = {
    TableName: "news-reader-video-clip", 
    Limit: 10
  };

  client.scan(params, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        var items = [];
        for (var i in data.Items)
            items.push(data.Items[i]);
        items = getClipsByFullName(items, fullName);
        res.contentType = 'application/json';
        res.send(items);
    }
  });
});


//TODO: Remove
const getClipsByFullName = (items, fullName) => {
  return items.filter((item)=>{
    return item.PersonFullName == fullName;
  });
}



app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});