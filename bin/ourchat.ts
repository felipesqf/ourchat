#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DynamoDBStack } from '../lib/dynamodb-stack';
import { LambdaStack } from '../lib/lambda-stack';
import { ApiStack } from '../lib/websocket-stack';

const app = new cdk.App();

// Create the DynamoDB stack
const dynamoDBStack = new DynamoDBStack(app, 'DynamoDBStack');

// Create the Lambda stack, passing the DynamoDB stack to give it access to the tables
const lambdaStack = new LambdaStack(app, 'LambdaStack', {
  dynamodbStack: dynamoDBStack,
});

// Create the API Gateway stack, passing the Lambda stack to connect the WebSocket routes to Lambda functions
new ApiStack(app, 'ApiStack', {
  lambdaStack: lambdaStack,
});