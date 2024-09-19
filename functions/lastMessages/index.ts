import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'; // Import DynamoDB Client and QueryCommand
// Create an instance of DynamoDBClient
const dynamoDb = new DynamoDBClient({}); 

exports.handler = async (event: any) => {
  // Extract threadId from the request's path parameters
  const { threadId } = event.pathParameters;

  // Define parameters for querying DynamoDB using the GSI (GSI1)
  const params = {
    TableName: process.env.MESSAGE_TABLE_NAME, 
    KeyConditionExpression: 'GSI1PK = :threadId', 
    ExpressionAttributeValues: {
      ':threadId': { S: threadId }, 
    },
    Limit: 10, 
    ScanIndexForward: false, 
    IndexName: 'GSI1', 
  };

  try {
    const command = new QueryCommand(params); 
    const data = await dynamoDb.send(command); 

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (err) {
    // treating any errors during the query
    return {
      statusCode: 500, 
      body: JSON.stringify(err), 
    };
  }
};
