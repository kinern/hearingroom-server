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

/* AWS DynamoDB Connection Settings */
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const client = new AWS.DynamoDB.DocumentClient();
const tableName = 'news-reader';

//Test route for server.
app.get("/", (req, res) => {
  res.json({ message: "The server is running." });
});

//Queries... need to seperate out into routes folder

//Get all records - currently limited to 10...
app.get("/news-reader/all", (req, res) => {

  var params = {
    TableName: tableName, //"news-reader"
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

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});