import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({});

export const handler = async (event: any) => {
  console.log('Event:', JSON.stringify(event));

  const { connectionId, message } = JSON.parse(event.body);

  const params = {
    TableName: process.env.MESSAGES_TABLE_NAME!,
    Item: {
      messageId: { S: connectionId },
      timestamp: { S: new Date().toISOString() },
      content: { S: message },
    },
  };

  try {
    await client.send(new PutItemCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
    } catch (err) {
        // treat errors t
        return {
        statusCode: 500,
        body: JSON.stringify(err),
    };
  }
};
