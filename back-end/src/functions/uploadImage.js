const AWS = require('aws-sdk');
const s3 = new AWS.S3();
import {
  DynamoDBDocumentClient,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient({region: 'us-west-2'});
const dynamoDb = DynamoDBDocumentClient.from(client);

async function updateNestedObject(tableName, primaryKey, primaryValue, nestedObjectKeys, newDatas) {
  const newData = JSON.parse(newDatas);
  const updateExpression = Object.keys(newData).map((key) => {
    const sanitizedKey = key.replace(/[^a-zA-Z0-9]/g, '');
    return `#${nestedObjectKeys.join('.#')}.#${sanitizedKey} = :${sanitizedKey}`;
  }).join(", ");
  const expressionAttributeNames = nestedObjectKeys.reduce((acc, key) => {
    acc[`#${key}`] = key;
    return acc;
  }, {});
  Object.keys(newData).forEach((key) => {
    const sanitizedKey = key.replace(/[^a-zA-Z0-9]/g, '');
    expressionAttributeNames[`#${sanitizedKey}`] = key;
  });
  const expressionAttributeValues = Object.entries(newData).reduce((acc, [key, value]) => {
    const sanitizedKey = key.replace(/[^a-zA-Z0-9]/g, '');
    acc[`:${sanitizedKey}`] = value;
    return acc;
  }, {});
  const params = {
    TableName: tableName,
    Key: {
      [primaryKey]: primaryValue
    },
    UpdateExpression: `SET ${updateExpression}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues
  };
  try {
    await dynamoDb.send(new UpdateCommand(params));
    console.log("Update succeeded");
  } catch (err) {
    console.error("Update failed", err);
  }
}

exports.handler = async (event) => {
  var path = JSON.stringify(event['path']);
  path.replace('"','');
  const pathArray = path.split("/");
  pathArray.shift();
  pathArray.shift();
  pathArray[pathArray.length-1] = pathArray[pathArray.length-1].replace('\"','');
  pathArray.unshift("entityName");
  console.log(pathArray);
  const bucket = 'cs-493-restful-api-main-253515352635'
  const contentDispositionHeader = event.body.match(/Content-Disposition: form-data; name=""; filename="(.+)"/i);
  console.log(`THIS TIS THE EXTRACT HEADER DATA: ${contentDispositionHeader}`);
  const imageName = contentDispositionHeader ? contentDispositionHeader[1] : 'default.jpg';
  const contentType = event.headers['Content-Type'] || 'image/jpeg';
  let imageType = contentType.split('/')[1];
  console.log(contentType);
  console.log(`THIS IS THE IMAGE NAME: ${imageName}`);
  const binaryImageData = Buffer.from(event.body, 'base64');
  let date = new Date().toJSON();
  let result = date.split('.')[0];
  let imageAddress = `https://cs-493-restful-api-main-253515352635.s3.us-west-2.amazonaws.com/images/${result}.${imageType}`;
  let imageThumbnailAddress = `https://cs-493-restful-api-main-253515352635.s3.us-west-2.amazonaws.com/thumbnails/${result}.${imageType}`;
  try {
    await s3.putObject({
      Bucket: bucket,
      Key: `images/${result}.${imageType}`,
      Body: binaryImageData,
      ContentType: contentType
    }).promise();
    const newData = JSON.stringify({result : imageAddress});
    console.log(newData);
    await updateNestedObject("cs-493-restful-api-main-data", "id", "business", pathArray, {result: imageAddress});
    await updateNestedObject("cs-493-restful-api-main-data", "id", "business", pathArray, {result: imageThumbnailAddress});
    return {
      
      statusCode: 200,
      body: JSON.stringify({ message: `Image uploaded successfully: ${imageAddress}` })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to upload image' })
    };
  }
};