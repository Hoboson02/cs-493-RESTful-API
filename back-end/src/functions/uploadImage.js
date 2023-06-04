const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  console.log(event.body);
  const bucket = 'cs-493-restful-api-main-253515352635'
  const imageName = event.queryStringParameters.imageName;
  const binaryImageData = Buffer.from(event.body, 'base64');
  try {
    await s3.putObject({
      Bucket: bucket,
      Key: imageName,
      Body: binaryImageData,
      ContentType: 'image/jpeg'
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Image uploaded successfully' })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to upload image' })
    };
  }
};