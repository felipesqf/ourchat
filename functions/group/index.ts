import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const dynamoDbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoDbClient);

const tableName = process.env.GROUP_TABLE_NAME!;

exports.handler = async (event: any) => {
  const { groupId, groupName, emoticon, lastMessageAt } = JSON.parse(event.body);

  const params = {
    TableName: tableName,
    Item: {
      groupId,
      groupName,
      createdAt: new Date().toISOString(),
      emoticon: emoticon || '',
      lastMessageAt: lastMessageAt || '',
    },
  };

  try {
    await docClient.send(new PutCommand(params));
    return { statusCode: 200, body: JSON.stringify({ message: 'Group created successfully!' }) };
  } catch (error) {
    console.error('Error creating group:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not create group' }) };
  }
};
