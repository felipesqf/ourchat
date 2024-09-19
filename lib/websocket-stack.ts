// lib/api-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigwv2integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { LambdaStack } from './lambda-stack';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigwv2cfn from 'aws-cdk-lib/aws-apigatewayv2';

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps & { lambdaStack: LambdaStack }) {
    super(scope, id, props);

    const { connectFunction, messageFunction, getLastMessagesLambda, getThreadsByGroupLambda, addUserFunction, addGroupFunction } = props.lambdaStack;

    // Create HTTP API Gateway
    const httpApi = new apigateway.RestApi(this, 'HttpApi', {
      restApiName: 'HTTP API',
      description: 'This service serves HTTP endpoints',
    });

    const userResource = httpApi.root.addResource('user');
    userResource.addMethod('POST', new apigateway.LambdaIntegration(addUserFunction));

    const groupResource = httpApi.root.addResource('group');
    groupResource.addMethod('POST', new apigateway.LambdaIntegration(addGroupFunction));

    // Create WebSocket API Gateway
    const webSocketApi = new apigwv2.CfnApi(this, 'WebSocketApi', {
      name: 'WebSocketAPI',
      protocolType: 'WEBSOCKET',
      routeSelectionExpression: '$request.body.action',
    });

    // WebSocket Integrations
    const connectIntegration = new apigwv2.CfnIntegration(this, 'ConnectIntegration', {
      apiId: webSocketApi.ref,
      integrationType: 'AWS_PROXY',
      integrationUri: `arn:aws:lambda:${this.region}:${this.account}:function:${connectFunction.functionName}`,
    });

    const messageIntegration = new apigwv2.CfnIntegration(this, 'MessageIntegration', {
      apiId: webSocketApi.ref,
      integrationType: 'AWS_PROXY',
      integrationUri: `arn:aws:lambda:${this.region}:${this.account}:function:${messageFunction.functionName}`,
    });

    const getLastMessagesIntegration = new apigwv2.CfnIntegration(this, 'GetLastMessagesIntegration', {
      apiId: webSocketApi.ref,
      integrationType: 'AWS_PROXY',
      integrationUri: `arn:aws:lambda:${this.region}:${this.account}:function:${getLastMessagesLambda.functionName}`,
    });

    const getThreadsByGroupIntegration = new apigwv2.CfnIntegration(this, 'GetThreadsByGroupIntegration', {
      apiId: webSocketApi.ref,
      integrationType: 'AWS_PROXY',
      integrationUri: `arn:aws:lambda:${this.region}:${this.account}:function:${getThreadsByGroupLambda.functionName}`,
    });

    // WebSocket Routes
    new apigwv2.CfnRoute(this, 'ConnectRoute', {
      apiId: webSocketApi.ref,
      routeKey: '$connect',
      target: `integrations/${connectIntegration.ref}`,
    });

    new apigwv2.CfnRoute(this, 'MessageRoute', {
      apiId: webSocketApi.ref,
      routeKey: 'message',
      target: `integrations/${messageIntegration.ref}`,
    });

    new apigwv2.CfnRoute(this, 'GetLastMessagesRoute', {
      apiId: webSocketApi.ref,
      routeKey: 'getLastMessages',
      target: `integrations/${getLastMessagesIntegration.ref}`,
    });

    new apigwv2.CfnRoute(this, 'GetThreadsByGroupRoute', {
      apiId: webSocketApi.ref,
      routeKey: 'getThreadsByGroup',
      target: `integrations/${getThreadsByGroupIntegration.ref}`,
    });
  }
}
