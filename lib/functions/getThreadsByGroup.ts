import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'; // Import DynamoDB Client and QueryCommand

// Create a new instance of DynamoDBClient
const dynamoDb = new DynamoDBClient({});

// Lambda handler function to retrieve all threads for a specific group
exports.handler = async (event: any) => {
  // Extract groupId from the request's path parameters
  const { groupId } = event.pathParameters;

  // Define the params for querying the DynamoDB 
  const params = {
    TableName: process.env.THREAD_TABLE_NAME, 
    KeyConditionExpression: 'GSI1PK = :groupId',
    ExpressionAttributeValues: {
      ':groupId': { S: groupId }, 
    },
    ScanIndexForward: false, 
    IndexName: 'GSI1', 
  };

  try {
    const command = new QueryCommand(params); 
    const data = await dynamoDb.send(command);

    // Return the results
    return {
      statusCode: 200, 
      body: JSON.stringify(data.Items), 
    };
    } catch (err) {
        // treat errors t
        return {
        statusCode: 500,
        body: JSON.stringify(err),
        };
    }
};
