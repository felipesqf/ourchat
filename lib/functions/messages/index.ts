const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event: { body: string; }) => {
  const { messageId, content, senderUserId, createdAt, groupId, threadId } = JSON.parse(event.body);

  if (!messageId || !content || !senderUserId || !createdAt || !groupId || !threadId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required parameters' }),
    };
  }

  const params = {
    TableName: process.env.MESSAGES_TABLE_NAME,
    Item: {
      messageId,
      content,
      senderUserId,
      createdAt,
      GSI1PK: groupId, // Primary key for the GSI
      GSI1SK: threadId, // Sort key for the GSI
    },
  };

  try {
    await dynamoDB.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message stored successfully' }),
    };
  } catch (error) {
    console.error('Error storing message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error storing message' }),
    };
  }
};
