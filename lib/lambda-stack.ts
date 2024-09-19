// lib/lambda-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as path from 'path';
import { DynamoDBStack } from './dynamodb-stack';

export class LambdaStack extends cdk.Stack {
  public readonly connectFunction: lambda.Function;
  public readonly messageFunction: lambda.Function;
  public readonly getLastMessagesLambda: lambda.Function;
  public readonly getThreadsByGroupLambda: lambda.Function;

  constructor(scope: Construct, id: string, props: cdk.StackProps & { dynamodbStack: DynamoDBStack }) {
    super(scope, id, props);

    const { messageTable, threadTable, groupTable } = props.dynamodbStack;

    // Lambda to connect to the chat
    this.connectFunction = new lambda.Function(this, 'ConnectFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'connect.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'functions')),
      environment: {
        MESSAGES_TABLE_NAME: messageTable.tableName,
      },
      logRetention: logs.RetentionDays.ONE_WEEK, 
    });

    // Lambda to send the message
    this.messageFunction = new lambda.Function(this, 'MessageFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'message.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'functions')),
      environment: {
        MESSAGES_TABLE_NAME: messageTable.tableName,
      },
    });

    // Lambda that will retrieve last 10 messages from a Thread
    this.getLastMessagesLambda = new lambda.Function(this, 'GetLastMessagesFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'getLastMessages.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'functions')),
      environment: {
        MESSAGE_TABLE_NAME: messageTable.tableName,
      },
      logRetention: logs.RetentionDays.ONE_WEEK, 
    });

    // Lambda that will retrieve all threads associated with a specific group
    this.getThreadsByGroupLambda = new lambda.Function(this, 'GetThreadsByGroupFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'getThreadsByGroup.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'functions')),
      environment: {
        THREAD_TABLE_NAME: threadTable.tableName,
        GROUP_TABLE_NAME: groupTable.tableName,
      },
      logRetention: logs.RetentionDays.ONE_WEEK, 
    });

    // Grant the Lambda functions access to DynamoDB Tables
    messageTable.grantReadWriteData(this.connectFunction);
    messageTable.grantReadWriteData(this.messageFunction);
    messageTable.grantReadData(this.getLastMessagesLambda);
    threadTable.grantReadData(this.getThreadsByGroupLambda);
    groupTable.grantReadData(this.getThreadsByGroupLambda);
  }
}
