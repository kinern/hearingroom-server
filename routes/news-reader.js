const AWS = require('aws-sdk');
const client = new AWS.DynamoDB.DocumentClient();
const tableName = 'news-reader';

AWS.config.update({ region: 'us-west-2' });

app.get("/news-reader/all", (req, res) => {
    var params = {
        TableName: tableName
    };

    client.scan(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            var items = [];
            for (var i in data.Items)
                items.push(data.Items[i]['Name']);

            res.contentType = 'application/json';
            res.send(items);
        }
    });
});

