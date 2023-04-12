const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});
const docClient = new AWS.DynamoDB.DocumentClient();
const newData = {
	"testBusiness3":{
		"reviews":{
			"reviewTest3":{
				"starRating":"2/5",
				"reviewContent":"It was mostly terrible",
				"priceRating":"$$$$$$$"
			},
			"reviewTest2":{
				"starRating":"3/5",
				"reviewContent":"It was alright",
				"priceRating":"$$$$$$$"
			},
			"reviewTest1":{
				"starRating":"5/5",
				"reviewContent":"It was the best!",
				"priceRating":"$$$$$$$"
			}
		},
		"photos":{

		},
		"info":{
			"zipCode":"97702",
			"address":"1500 SW Chandler Ave.",
			"city":"Bend",
			"name":"OSU-Cascades",
			"phone#":"(541) 322-3100",
			"state":"Oregon",
			"category":"University"
		}
	}
}

async function updateNestedObject(tableName, primaryKey, primaryValue, nestedObjectKey, newData) {
	const updateExpression = Object.keys(newData).map((key) => `${nestedObjectKey}.${key} = :${key}`).join(', ');
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
	await docClient.update(params).promise();
	console.log('Update succeeded');
	} catch (err) {
	console.error('Update failed', err);
	}
}

updateNestedObject('api-gateway-test', 'id', 'business', 'entityName', newData);
