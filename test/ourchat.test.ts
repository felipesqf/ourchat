import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { DynamoDBStack } from '../lib/dynamodb-stack';
import { LambdaStack } from '../lib/lambda-stack';
import { ApiStack } from '../lib/websocket-stack';

test('Ourchat Stack', () => {
  const app = new cdk.App();

  // Create DynamoDB Stack
  const dynamoDBStack = new DynamoDBStack(app, 'TestDynamoDBStack');
  
  // Create Lambda Stack and pass the DynamoDB Stack as a prop
  const lambdaStack = new LambdaStack(app, 'TestLambdaStack', {
    dynamodbStack: dynamoDBStack,
  });

  // Create API Gateway Stack with the Lambda Stack as a prop
  const apiStack = new ApiStack(app, 'TestApiStack', {
    lambdaStack: lambdaStack,
  });

  // Validate the template
  const template = Template.fromStack(apiStack);

  // Example assertions (you can customize these based on your stack requirements)
  template.hasResourceProperties('AWS::ApiGatewayV2::Api', {
    ProtocolType: 'WEBSOCKET',
  });
});
