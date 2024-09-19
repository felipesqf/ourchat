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
  public readonly addUserFunction: lambda.Function;
  public readonly addGroupFunction: lambda.Function;

  constructor(scope: Construct, id: string, props: cdk.StackProps & { dynamodbStack: DynamoDBStack }) {
    super(scope, id, props);

    const { messageTable, threadTable, groupTable, userTable } = props.dynamodbStack;

    // Lambda to connect to the chat
    this.connectFunction = new lambda.Function(this, 'ConnectFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, './functions/connect')),
      environment: {
        MESSAGES_TABLE_NAME: messageTable.tableName,
      },
      logRetention: logs.RetentionDays.ONE_WEEK, 
    });

    // Lambda to send the message
    this.messageFunction = new lambda.Function(this, 'MessageFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, './functions/messages')),
      environment: {
        MESSAGES_TABLE_NAME: messageTable.tableName,
      },
    });

    // Lambda that will retrieve last 10 messages from a Thread
    this.getLastMessagesLambda = new lambda.Function(this, 'GetLastMessagesFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, './functions/lastMessages')),
      environment: {
        MESSAGE_TABLE_NAME: messageTable.tableName,
      },
      logRetention: logs.RetentionDays.ONE_WEEK, 
    });

    // Lambda that will retrieve all threads associated with a specific group
    this.getThreadsByGroupLambda = new lambda.Function(this, 'GetThreadsByGroupFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, './functions/thread')),
      environment: {
        THREAD_TABLE_NAME: threadTable.tableName,
        GROUP_TABLE_NAME: groupTable.tableName,
      },
      logRetention: logs.RetentionDays.ONE_WEEK, 
    });

    // Lambda function for User
    this.addUserFunction = new lambda.Function(this, 'addUserFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('./functions/user'),
      handler: 'index.handler',
      environment: {
        USER_TABLE_NAME: userTable.tableName,
      },
    });

    // Lambda function for Group
    this.addGroupFunction = new lambda.Function(this, 'addGroupFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('./functions/group'),
      handler: 'index.handler',
      environment: {
        GROUP_TABLE_NAME: groupTable.tableName,
      },
    });

    // Grant the Lambda functions access to DynamoDB Tables
    messageTable.grantReadWriteData(this.connectFunction);
    messageTable.grantReadWriteData(this.messageFunction);
    messageTable.grantReadData(this.getLastMessagesLambda);
    threadTable.grantReadData(this.getThreadsByGroupLambda);
    groupTable.grantReadData(this.getThreadsByGroupLambda);
    groupTable.grantWriteData(this.addGroupFunction);
    userTable.grantWriteData(this.addUserFunction);
  }
}
