const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { username, password } = body;
  const userPoolId = 'us-west-2_ekoh7tmz0';
  const clientId = '53celvm09ucuh4cpiui7ugtvv2';
  try {
    await cognito.signUp({
      ClientId: clientId,
      Username: username,
      Password: password,
    }).promise();
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};