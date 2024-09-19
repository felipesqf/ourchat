import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as autoscaling from 'aws-cdk-lib/aws-applicationautoscaling';

export class DynamoDBStack extends cdk.Stack {
  public readonly userTable: dynamodb.Table;
  public readonly groupTable: dynamodb.Table;
  public readonly threadTable: dynamodb.Table;
  public readonly messageTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create User Table
    this.userTable = new dynamodb.Table(this, 'UserTable', {
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      contributorInsightsEnabled: true,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    //   readCapacity: 5,
    //   writeCapacity: 5,
    });

    // Create Group Table
    this.groupTable = new dynamodb.Table(this, 'GroupTable', {
      partitionKey: { name: 'groupId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      contributorInsightsEnabled: true,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    // Create Thread Table
    this.threadTable = new dynamodb.Table(this, 'ThreadTable', {
      partitionKey: { name: 'threadId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      contributorInsightsEnabled: true,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    // Create Message Table with GSI (for querying by groupId and threadId)
    this.messageTable = new dynamodb.Table(this, 'MessageTable', {
      partitionKey: { name: 'messageId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING }, // createdAt as sort key
      contributorInsightsEnabled: true,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    // GSI for querying messages by groupId and threadId
    this.messageTable.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: { name: 'GSI1PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'GSI1SK', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

// Enable auto-scaling for the write capacity of the table
const writeScalingTarget = new autoscaling.CfnScalableTarget(this, 'DynamoDbTableWriteScalingTarget', {
    maxCapacity: 10, // Set the maximum capacity to scale up to
    minCapacity: 5, // Set the minimum capacity to ensure at least one capacity unit is provisioned
    resourceId: `table/${this.messageTable.tableName}`, // Specify the resource ID of the DynamoDB table
    scalableDimension: 'dynamodb:table:WriteCapacityUnits', // Define the scalable dimension for write capacity
    serviceNamespace: 'dynamodb', // Set the service namespace to DynamoDB
  });
  
  // Set the target utilization percentage for the write capacity
  const writeScalingPolicy = new autoscaling.CfnScalingPolicy(this, 'DynamoDbTableWriteScalingPolicy', {
    policyName: 'DynamoDbTableWriteScalingPolicy', // Specify the name of the scaling policy
    policyType: 'TargetTrackingScaling', // Define the type of scaling policy as target tracking
    scalingTargetId: writeScalingTarget.ref, // Reference the scalable target ID
    targetTrackingScalingPolicyConfiguration: {
    predefinedMetricSpecification: {
    predefinedMetricType: 'DynamoDBWriteCapacityUtilization', // Specify the predefined metric type for DynamoDB write capacity utilization
    },
    targetValue: 50, // Set the target value for write capacity utilization
    },
  });

  }
}


