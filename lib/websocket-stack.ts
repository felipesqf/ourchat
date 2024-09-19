// lib/api-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigwv2integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { LambdaStack } from './lambda-stack';

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps & { lambdaStack: LambdaStack }) {
    super(scope, id, props);

    const { connectFunction, messageFunction } = props.lambdaStack;

    // Create WebSocket API
    const websocketApi = new apigwv2.CfnApi(this, 'WebSocketApi', {
      name: 'RealTimeChatWebSocketApi',
      protocolType: 'WEBSOCKET',
    });

    // Create WebSocket Routes
    new apigwv2.CfnRoute(this, 'ConnectRoute', {
      apiId: websocketApi.ref,
      routeKey: '$connect',
      target: `integrations/${connectFunction.functionArn}`,
    });

    new apigwv2.CfnRoute(this, 'MessageRoute', {
      apiId: websocketApi.ref,
      routeKey: 'sendMessage',
      target: `integrations/${messageFunction.functionArn}`,
    });

    // Create Integrations for Routes websocket to lambda
    new apigwv2.CfnIntegration(this, 'ConnectIntegration', {
      apiId: websocketApi.ref,
      integrationType: 'AWS_PROXY',
      integrationUri: `arn:aws:apigateway:${cdk.Aws.REGION}:lambda:path/2015-03-31/functions/${connectFunction.functionArn}/invocations`,
      payloadFormatVersion: '2.0',
    });

    new apigwv2.CfnIntegration(this, 'MessageIntegration', {
      apiId: websocketApi.ref,
      integrationType: 'AWS_PROXY',
      integrationUri: `arn:aws:apigateway:${cdk.Aws.REGION}:lambda:path/2015-03-31/functions/${messageFunction.functionArn}/invocations`,
      payloadFormatVersion: '2.0',
    });

    // Create WebSocket Stages
    new apigwv2.CfnStage(this, 'WebSocketStage', {
      apiId: websocketApi.ref,
      stageName: '$default',
      autoDeploy: true,
    });

    // Output of the websocket URL
    new cdk.CfnOutput(this, 'WebSocketApiUrl', {
      value: `wss://${websocketApi.ref}.execute-api.${cdk.Aws.REGION}.amazonaws.com/$default`,
    });
    
  }
}
