import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand, 
  UpdateCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();
const jwt = require('jsonwebtoken');
const client = new DynamoDBClient({region: 'us-west-2'});

const dynamoDb = DynamoDBDocumentClient.from(client);

const TABLE = 'cs-493-restful-api-main-data';

function onlyContainsChar(str, char) {
  for (let i = 0; i < str.length; i++) {
    if (str[i] !== char) {
      return false;
    }
  }
  return true;
}

async function getUserUUID(idToken) {
  idToken = idToken.split(' ');
  idToken = idToken[1];
  console.log(idToken)
  const params = {
    AccessToken: idToken
  };
  try {
    const decoded = jwt.decode(idToken);
    // const response = await cognito.getUser(params).promise();
    const sub = decoded.sub;
    // const sub = response.UserAttributes.find(attribute => attribute.Name === 'sub').Value;
    return sub;
  } catch (error) {
    console.error('An error occurred while calling cognito.getUser:', error);
    return null;
  }
}

async function verifyIdToken(idToken, user) {
  if (idToken == null) {
    return false;
  }
  let uuid = await getUserUUID(idToken)
  // const decodedToken = jwt.decode(idToken, {complete: true});
  // const sub = decodedToken.payload.sub;
  console.log(`user: ${user}- idToken: ${uuid}`)
  if (uuid == user) {
    return true;
  } else {
    console.log('User not found');
    return false;
  }
}

async function deleteNestedObject(tableName, primaryKey, primaryValue, nestedObjectKeys) {
 const updateExpression = `REMOVE ${nestedObjectKeys.join('.')}`;
 const params = {
  TableName: tableName,
  Key: {
   [primaryKey]: primaryValue
  },
  UpdateExpression: updateExpression,
  ReturnValues: 'ALL_NEW'
 };
 try {
    await dynamoDb.send(new UpdateCommand(params));
    console.log("Delete succeeded");
  } catch (err) {
    console.error("Delete failed", err);
  }
}

async function updateNestedObject(tableName, primaryKey, primaryValue, nestedObjectKeys, newDatas) {
  const newData = JSON.parse(newDatas);
  const updateExpression = Object.keys(newData).map((key) => `${nestedObjectKeys.join('.')}.${key} = :${key}`).join(", ");
  const expressionAttributeValues = Object.entries(newData).reduce((acc, [key, value]) => {
    acc[`:${key}`] = value;
    return acc;
  }, {});
  const params = {
    TableName: tableName,
    Key: {
      [primaryKey]: primaryValue
    },
    UpdateExpression: `SET ${updateExpression}`,
    ExpressionAttributeValues: expressionAttributeValues
  };
  try {
    await dynamoDb.send(new UpdateCommand(params));
    console.log("Update succeeded");
  } catch (err) {
    console.error("Update failed", err);
  }
}

export const handler = async (event) => {
 const request = event['httpMethod'];
 console.log(request);
 let data = await dynamoDb.send(
  new ScanCommand({ TableName: TABLE })
  );
  // data = data.Items;
 const response = {
   isBase64Encoded: false,
   headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
 };
 
 if ((typeof data) === 'object') {
   response.statusCode = 200;
   
   var path = JSON.stringify(event['path']);
   path.replace('"','');
   const pathArray = path.split("/");
   // pathArray.pop()
   pathArray.shift();
   pathArray[pathArray.length-1] = pathArray[pathArray.length-1].replace('\"','');
   const businessPath = data['Items'][0];
   const userPath = data['Items'][1];
   const eventBody = event['body'];
   switch (request) {
    case 'GET':
     if (pathArray[0] == 'business') {
      let result = businessPath;
      if (pathArray.length >= 1) {
       result = result['entityName'];
       for (let i = 1; i < pathArray.length; i++) {
            result = result[pathArray[i]];
        }
      }
      response.body = JSON.stringify(result);
     }
     else if (pathArray[0] == 'user'){
      console.log(pathArray[0]);
      try {
        console.log(event.headers);
        const idToken = event.headers.Authorization;
        console.log("Tried to get idToken");
        if (await verifyIdToken(idToken, pathArray[1])) {
          console.log("Verified User");
          let result = userPath;
          if (pathArray.length >= 1) {
            result = result['entityName'];
            for (let i = 1; i < pathArray.length; i++) {
                  result = result[pathArray[i]];
            }
          }
          response.body = JSON.stringify(result);
          console.log(result);
        }
        else {
          console.log("idToken failed");
          throw new TypeError("idToken failed");
        }
        
      }
      catch {
        response.body = 'Invalid Credentials';
        response.statusCode = 401;
      }
      }
     else {
      response.body = JSON.stringify(data['Items']);
     }
     break;
    case 'POST':
     if (pathArray[0] == 'business') {
      let result = ["entityName"];
      for (let i = 1; i < pathArray.length; i++) {
            result.push(pathArray[i]);
        }
      console.log(typeof eventBody);
      let jsonEventBody = JSON.parse(eventBody);
      for (const business in jsonEventBody) {
        console.log(business);
        let reviews = jsonEventBody;
        if (jsonEventBody[business].hasOwnProperty("reviews")) {
          reviews = reviews[business].reviews;
        }
        for (const review in reviews) {
          if (reviews[review].starRating > 5 || reviews[review].starRating < 0 || reviews[review].starRating.match(/^\d+$/) == null) {
            result.push("Your Rating was Invalid");
            break;
          }
          if (reviews[review].priceRating.length > 4 || reviews[review].priceRating.length < 1 || !onlyContainsChar(reviews[review].priceRating, "$")) {
            result.push("Your Rating was Invalid");
            break;
          }
        }
      }
      console.log(result);
      if (result.toString().includes("Your Rating was Invalid")) {
        result = "One of your ratings was invalid. For your star rating please make sure you are only inputting a number from 0-5 and that you are only inputting a $ between 1-4 times for your price rating.";
      } else {
        updateNestedObject("cs-493-restful-api-main-data", "id", "business", result, eventBody);
        result = "Your POST request was successfully completed";
      }
    //   updateNestedObject("cs-493-restful-api-main-data", "id", "business", result, eventBody);
      response.body = JSON.stringify(result);
     }
     else if (pathArray[0] == 'user'){
      updateNestedObject("cs-493-restful-api-main-data", "id", "user", ["entityName"], eventBody);
      response.body = JSON.stringify(event);
     }
     else {
      response.body = JSON.stringify(data['Items']);
     }
     // response.body = request
     break;
    case 'DELETE':
     if (pathArray[0] == 'business') {
      let result = ["entityName"];
      for (let i = 1; i < pathArray.length; i++) {
            result.push(pathArray[i]);
        }
      deleteNestedObject("cs-493-restful-api-main-data", "id", "business", result);
      result = "Your DELETE request was successfully completed";
      response.body = JSON.stringify(result);
     }
     else if (pathArray[0] == 'user'){
      let result = ["entityName"];
      for (let i = 1; i < pathArray.length; i++) {
            result.push(pathArray[i]);
        }
      deleteNestedObject("cs-493-restful-api-main-data", "id", "user", result);
      result = "Your DELETE request was successfully completed";
      response.body = JSON.stringify(result);
     }
     else{
      response.body = JSON.stringify(data['Items']);
     }
     break;
    case 'PUT':
     if (pathArray[0] == 'business') {
      let result = ["entityName"];
      for (let i = 1; i < pathArray.length; i++) {
            result.push(pathArray[i]);
        }
      console.log(typeof eventBody);
      let jsonEventBody = JSON.parse(eventBody);
      for (const business in jsonEventBody) {
        console.log(business);
        let reviews = jsonEventBody;
        if (jsonEventBody[business].hasOwnProperty("reviews")) {
          reviews = reviews[business].reviews;
        }
        for (const review in reviews) {
          if (reviews[review].starRating > 5 || reviews[review].starRating < 0 || reviews[review].starRating.match(/^\d+$/) == null) {
            result.push("Your Rating was Invalid");
            break;
          }
          if (reviews[review].priceRating.length > 4 || reviews[review].priceRating.length < 1 || !onlyContainsChar(reviews[review].priceRating, "$")) {
            result.push("Your Rating was Invalid");
            break;
          }
        }
      }
      console.log(result);
      if (result.toString().includes("Your Rating was Invalid")) {
        result = "One of your ratings was invalid. For your star rating please make sure you are only inputting a number from 0-5 and that you are only inputting a $ between 1-4 times for your price rating.";
      } else {
        updateNestedObject("cs-493-restful-api-main-data", "id", "business", result, eventBody);
        result = "Your PUT request was successfully completed";
      }
    //   updateNestedObject("cs-493-restful-api-main-data", "id", "business", result, eventBody);
      response.body = JSON.stringify(result);
     }
     else if (pathArray[0] == 'user'){
      updateNestedObject("cs-493-restful-api-main-data", "id", "user", ["entityName"], eventBody);
      response.body = JSON.stringify(event);
     }
     else {
      response.body = JSON.stringify(data['Items']);
     }
     // response.body = request
     break;
    default: 
     response.body = (`Unknown request: ${request}`);
   }
 } else {
   response.statusCode = 500;
 }
 console.log(response);
 return response;
};