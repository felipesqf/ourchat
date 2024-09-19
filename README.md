# AWS Technical Test
This is an chat application running on a Serverless stack featuring API Gateway, Lambda and DynamoDB as main compments, deployed using AWS CDK in Typescript<br><br>
​
This archtecture will create:<br>

- API Gateway Websockets
- 4 Lambda Functions
- 4 DynamoDB tables,
- AWS Roles
- KMS keys for Dynamo DB


## Archtecture
![screenshot1](https://github.com/felipesqf/ourchat/blob/main/hld.png) 


## Lambda Functions
- Lambda function getLastMessages retrieves the last 10 messages from a Thread based on the createdAt timestamp.
- Lambda function getThreadsByGroup Implement a query to retrieve all Threads associated with a specific Group ordered by the most recent message (lastMessageAt).
- Lambda function messageFunction will write messages to the dynamodb Message to store chat messages with attributes like
messageId, content, senderUserId, createdAt, and indexing attributes GSI1PK and GSI1SK for querying messages by groupId and threadId.
- Lambda function connectFunction will connect to the websocket and dynamodb Message table

## DynamoDB
- User: Store user profiles with attributes like userId, userName, createdAt, profileImageUrl (Can bemocked for time reasons), and dateOfBirth.
- Group: Store group with attributes like groupId, groupName, createdAt, emoticon, and lastMessageAt.
-  Thread: Store threads with attributes like threadId, threadName, createdAt, color.
-  Message: Store chat messages with attributes like messageId, content, senderUserId, createdAt, and indexing attributes GSI1PK and GSI1SK for querying messages by groupId and threadId.


## Requirements
- AWS Account
- AWS Access and Secret key


## Testing
- npm run build compile typescript to js
- npm run watch watch for changes and compile
- npm run test perform the jest unit tests


## Authentication
The authentication to the AWS account will happening using the AWS Access and SEcret key, which will need to be exported prior to the execution.


## Execution
- export AWS_ACCESS_KEY_ID=xxxxxxxxxxxxxxx
- export AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxx
- export AWS_DEFAULT_REGION=ap-southeast-2
- cdk synth
- cdk deploy --all


## Future Improvments: 
- Write lambda function to create User, Group and Thread using the same schema required by the dynamotable.
- Add WAF in front of the API Gateway to block ip by reputation List, geoblock or AnonIPAddress
- Add table name to AWS paramenter store 
- Include a disconnect route
- Improve tests

## Authors
Felipe Ferreira  <br><br>
Contact information:<br>
felipesqf@gmail.com<br>
Github: felipesqf<br>
+61 0406 021 252