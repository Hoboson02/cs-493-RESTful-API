const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  const { username, password } = event;
  const userPoolId = 'us-west-2_ekoh7tmz0'; // Replace with your user pool ID
  const clientId = '53celvm09ucuh4cpiui7ugtvv2'; // Replace with your user pool client ID

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