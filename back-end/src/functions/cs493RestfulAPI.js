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
    // const pathArray = path.split("/")
    pathArray = ['business', 'name']
    // pathArray.pop()
    // pathArray.shift()
    // pathArray[pathArray.length-1] = pathArray[pathArray.length-1].replace('\"','')
    if (pathArray[0] == 'business') {
      if (pathArray.length == 0) {
        response.body = JSON.stringify(businessPath[0]);
      }
      else {
        for (var i =0; i <= pathArray.length-1; i++) {
          body+=`[${pathArray[i]}]`
          console.log(pathArray[i])
        }
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