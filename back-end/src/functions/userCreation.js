const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();

async function getSub(username, userPoolId) {
  const params = {
    UserPoolId: userPoolId,
    Filter: `username = "${username}"`,
    Limit: 1
  };

  try {
    const response = await cognito.listUsers(params).promise();
    if (response.Users.length > 0) {
      const user = response.Users[0];
      const subAttribute = user.Attributes.find(attribute => attribute.Name === 'sub');
      return subAttribute.Value;
    }
  } catch (err) {
    console.error(err);
  }
}

async function addUser(tableName, userId) {
  const params = {
    TableName: tableName,
    Key: { id: 'user' },
    UpdateExpression: 'SET #entityName.#userId = :newUserDetails',
    ExpressionAttributeNames: {
      '#entityName': 'entityName',
      '#userId': userId
    },
    ExpressionAttributeValues: {
      ':newUserDetails': {
        'owned-businesses': [],
        photos: [],
        reviews: []
      }
    }
  };
  try {
    await docClient.update(params).promise();
    console.log(`Added user ${userId} to entityName object`);
  } catch (error) {
    console.error(error);
  }
}

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

    await cognito.adminConfirmSignUp({
      UserPoolId: userPoolId,
      Username: username
    }).promise();

    uuid = await getSub(username, userPoolId)
    await addUser('api-gateway-test', uuid);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};