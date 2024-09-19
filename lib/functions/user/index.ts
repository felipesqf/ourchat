import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

// Create DynamoDB client
const dynamoDbClient = new DynamoDBClient({});

// Create a DynamoDB Document Client
const docClient = DynamoDBDocumentClient.from(dynamoDbClient);

const tableName = process.env.USER_TABLE_NAME!;

exports.handler = async (event: any) => {
  const { userId, userName, profileImageUrl, dateOfBirth } = JSON.parse(event.body);

  const params = {
    TableName: tableName,
    Item: {
      userId,
      userName,
      createdAt: new Date().toISOString(),
      profileImageUrl: profileImageUrl || '',
      dateOfBirth,
    },
  };

  try {
    // Use the PutCommand with DynamoDBDocumentClient
    await docClient.send(new PutCommand(params));
    return { statusCode: 200, body: JSON.stringify({ message: 'User created successfully!' }) };
  } catch (error) {
    console.error('Error creating user:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not create user' }) };
  }
};
