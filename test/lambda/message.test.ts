// functions/messages/__tests__/index.test.ts

import { handler } from '../../functions/messages/index';
const AWS = require('aws-sdk');
import AWSMock from 'aws-sdk-mock';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

beforeEach(() => {
  AWSMock.setSDKInstance(AWS);
  AWSMock.mock('DynamoDB.DocumentClient', 'put', Promise.resolve());
});

afterEach(() => {
  AWSMock.restore();
});

test('should store message successfully', async () => {
  const event = {
    body: JSON.stringify({
      messageId: '123',
      content: 'Hello World',
      senderUserId: 'user1',
      createdAt: '2024-09-19T00:00:00Z',
      groupId: 'group1',
      threadId: 'thread1'
    }),
  };

  const result = await handler(event as any);

  expect(result.statusCode).toBe(200);
  expect(JSON.parse(result.body).message).toBe('Message stored successfully');
});

test('should return error for missing parameters', async () => {
  const event = {
    body: JSON.stringify({
      messageId: '123',
      content: 'Hello World',
      senderUserId: 'user1',
      createdAt: '2024-09-19T00:00:00Z',
      groupId: 'group1'
      // Missing threadId
    }),
  };

  const result = await handler(event as any);

  expect(result.statusCode).toBe(400);
  expect(JSON.parse(result.body).message).toBe('Missing required parameters');
});

