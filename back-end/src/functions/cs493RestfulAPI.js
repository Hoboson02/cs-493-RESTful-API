const AWS = require('aws-sdk');

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

const params = {
    TableName: 'api-gateway-test'
};
exports.handler = async (event) => {
 let data = await dynamoDbClient.scan(params);
 const response = {
   isBase64Encoded: false,
   headers: {'Content-Type': 'application/json'}
 };
 
 if ((typeof data) === 'object') {
   response.statusCode = 200;
   
   var path = JSON.stringify(event['path']);
   path.replace('"','')
    const pathArray = path.split("/")
    // pathArray.pop()
    pathArray.shift()
    pathArray[pathArray.length-1] = pathArray[pathArray.length-1].replace('\"','')
    if (pathArray[0] == 'business') {
     if (pathArray.length >= 1) {
      if (pathArray.length >= 2) {
       if (pathArray.length >= 3) {
        response.body = JSON.stringify(data['Items'][0]['name'][0][pathArray[1]][0][pathArray[2]][0]);
       }
       else {
        response.body = JSON.stringify(data['Items'][0]['name'][0][pathArray[1]][0]);
       }
      }
      else {
       response.body = JSON.stringify(data['Items'][0]['name']);
      }
     }
     else {
      response.body = JSON.stringify(data['Items'][0]);
     }
    }
    else if (pathArray[0] == 'user'){
     response.body = JSON.stringify(data['Items'][1]);
    }
    else {
     response.body = JSON.stringify(data['Items']);
    }
    // response.body = pathArray[pathArray.length-1]
   // response.body = JSON.stringify(event['path']);
 } else {
   response.statusCode = 500;
 }
 return response;
};