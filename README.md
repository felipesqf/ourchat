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



## Authors
Felipe Ferreira  <br><br>
Contact information:<br>
felipesqf@gmail.com<br>
Github: felipesqf<br>
+61 0406 021 252