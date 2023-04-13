import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand, 
  UpdateCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({region: 'us-west-2'});

const dynamoDb = DynamoDBDocumentClient.from(client);

const TABLE = 'api-gateway-test';

async function updateNestedObject(tableName, primaryKey, primaryValue, nestedObjectKey, newData) {
  const updateExpression = Object.keys(newData).map((key) => `${nestedObjectKey}.${key} = :${key}`).join(", ");
  const expressionAttributeValues = Object.entries(newData).reduce((acc, [key, value]) => {
    acc[`:${key}`] = value;
    return acc;
  }, {});
  const params = {
    TableName: tableName,
    Key: {
      [primaryKey]: primaryValue
    },
    UpdateExpression: `set ${updateExpression}`,
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
 
 const request = event['httpMethod']
 let data = await dynamoDb.send(
          new ScanCommand({ TableName: TABLE })
        );
        // data = data.Items;
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
   const businessPath = data['Items'][0]
   const userPath = data['Items'][1]
   switch (request) {
    case 'GET':
     if (pathArray[0] == 'business') {
      if (pathArray.length >= 1) {
       if (pathArray.length >= 2) {
        if (pathArray.length >= 3) {
         response.body = JSON.stringify(businessPath['entityName'][pathArray[1]][pathArray[2]]);
        }
        else {
         response.body = JSON.stringify(businessPath['entityName'][pathArray[1]]);
        }
       }
       else {
        response.body = JSON.stringify(businessPath['entityName']);
       }
      }
      else {
       response.body = JSON.stringify(businessPath);
      }
     }
     else if (pathArray[0] == 'user'){
      response.body = JSON.stringify(userPath);
     }
     else {
      response.body = JSON.stringify(data['Items']);
     }
     break;
     // response.body = pathArray[pathArray.length-1]
    // response.body = JSON.stringify(event['path']);
    case 'POST':
     if (pathArray[0] == 'business') {
      updateNestedObject("api-gateway-test", "id", "business", "entityName", event['body']);
      response.body = JSON.stringify(event['body']);
     }
     else if (pathArray[0] == 'user'){
      response.body = JSON.stringify(userPath);
     }
     else {
      response.body = JSON.stringify(data['Items']);
     }
     // response.body = request
     break;
    default: 
     response.body = (`Unknown request: ${request}`)
   }
 } else {
   response.statusCode = 500;
 }
 return response;
};