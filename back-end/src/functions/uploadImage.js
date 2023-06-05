const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  console.log(event.body);
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
  try {
    await s3.putObject({
      Bucket: bucket,
      Key: `images/${result}.${imageType}`,
      Body: binaryImageData,
      ContentType: contentType
    }).promise();

    return {
      
      statusCode: 200,
      body: JSON.stringify({ message: `Image uploaded successfully: https://cs-493-restful-api-main-253515352635.s3.us-west-2.amazonaws.com/images/${result}.${imageType}` })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to upload image' })
    };
  }
};