const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});

const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const params = {
    TableName: 'api-gateway-test'
};

table = ddb.scan(params, (err, data) => {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data);
    }
});
console.log(table)