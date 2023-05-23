const AWS = require('aws-sdk');
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  const { username, password } = JSON.parse(event.body);
  const userPoolId = 'us-west-2_ekoh7tmz0';
  const clientId = '53celvm09ucuh4cpiui7ugtvv2';

  const params = {
    AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
    ClientId: clientId,
    UserPoolId: userPoolId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password
    }
  };

  try {
    const response = await cognitoIdentityServiceProvider.adminInitiateAuth(params).promise();
    const idToken = response.AuthenticationResult.IdToken;
    return {
      statusCode: 200,
      body: JSON.stringify({ idToken })
    };
  } catch (error) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: error.message })
      };
  }
};