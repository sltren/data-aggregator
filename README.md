# Getting Started

## Prerequisites

- Node.js
- AWS SDK
- Typescript

## Installation

### Clone the repository:

```sh
git clone https://github.com/sltren/data_aggregator.git
```

cd data-aggregator

### Install dependencies:

```sh
$ npm install
```

### AWS Configuration

Before deploying your serverless application, you need to configure your AWS credentials.  
You can do this using the AWS CLI.  
Install the AWS CLI if you haven't already.  
Configure your AWS credentials.

```sh
$ aws configure
```

You will be prompted to enter:

AWS Access Key ID: xxxx  
AWS Secret Access Key: xxxx  
Default region name [your-region]: xxxx  
Default output format [json]: xxxx

These credentials will be used by the Serverless Framework to deploy your application to AWS.

### Deployment

Once your AWS credentials are configured, you can deploy your serverless application using the Serverless Framework.

### Deploy the application:

```sh
$ serverless deploy
```

### Remove the application:

```sh
$ serverless remove
```

This command will package and deploy your application to AWS, creating the necessary AWS resources such as Lambda functions,  
API Gateway endpoints, and DynamoDB tables.

## Usage

Define your DynamoDB table and configure the dynamodb-toolbox table instance.  
Define the entities using dynamodb-toolbox.  
Use the joi validation schema to validate data before performing any operations.  
Use the defined Lambda functions to feed data and retrieve aggregated data.  
Contributing  
Contributions are welcome! Please open an issue or submit a pull request for any changes or improvements.

## License

This project is licensed under the MIT License.

## Architecture

### DynamoDB

The system uses AWS DynamoDB as the primary data store.  
DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance with seamless scalability.

### dynamodb-toolbox

The dynamodb-toolbox library is used to define and interact with DynamoDB entities.  
It provides a high-level abstraction over the DynamoDB API, making it easier to work with DynamoDB tables and items.

### joi

The joi library is used for data validation.  
It ensures that the data being stored in DynamoDB meets the required schema and constraints.

### Entity Definition

The entity are defined using dynamodb-toolbox. It includes attributes such as yourFieldId, etc.

import { Entity } from 'dynamodb-toolbox';  
import { Table } from 'dynamodb-toolbox';

// Assuming you have already defined your table  
const table = new Table({  
name: 'yourName',  
partitionKey: 'PK',  
sortKey: 'SK',  
// other table configurations  
});

export const yourEnity = new Entity({  
name: "yourName",  
attributes: {  
yourFieldId: { partitionKey: true, type: "string" },  
// other table attributes  
},  
table,  
});

### Validation

The joi library is used to validate the entity.  
The attribute is validated against a set of allowed values using an enum-like structure.

enum definition  
const SomeEnum = {  
... enum items  
};

const validEnum = Object.values(SomeEnum);  
Validation Schema  
const Joi = require('joi');

const yourSchema = Joi.object({  
... other fields  
yourfield: Joi.string().valid(...validEnum).required(),  
});

validation function  
async function yourFunction(item) {  
// Validate the item against the schema  
const { error } = yourSchema.validate(item);  
if (error) {  
throw new Error(`Your message eror: ${error.message}`);  
}  
// If validation passes, proceed with the operation  
}

### Lambda Functions

#### Hello World

Description: Simple function hello world.  
Trigger: HTTP GET request -> https://{your-key}.execute-api.{your-region}.amazonaws.com/dev/hello  
Handler: handler.hello

#### Seed Company

Description: This function seeds company data into the system.  
Trigger: HTTP POST request -> https://{your-key}.execute-api.{your-region}.amazonaws.com/dev/seed/company  
Handler: handler.seedCompanyData

#### Seed User

Description: This function seeds user data into the system.  
Trigger: HTTP POST request -> https://{your-key}.execute-api.{your-region}.amazonaws.com/dev/seed/user  
Handler: handler.seedUserData

#### Seed Vulnerability

Description: This function feeds vulnerability data into the system.  
Trigger: HTTP POST request -> https://{your-key}.execute-api.{your-region}.amazonaws.com/dev/seed/vulnerability  
Handler: handler.seedVulnerabilityData

#### Get Aggregated Data

Description: This function retrieves aggregated data from the system.  
Trigger: HTTP GET request -> https://{your-key}.execute-api.{your-region}.amazonaws.com/dev/companies/{companyId}/data?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd  
Handler: handler.getAggregatedData

#### Aggregate Data

Description: This function aggregates data on a scheduled basis.  
Trigger: Scheduled event (e.g., cron job)  
Handler: handler.aggregateData

#### Example serverless.yml Configuration

Here's an example of how you might configure your serverless.yml file to define these functions and their triggers:

service: your-service

provider:  
name: aws  
runtime: nodejs20.x  
environment:  
... env variables

plugins:  
serverless-plugins  
...

custom:  
...

functions:  
function1:  
handler: handler.function1  
events: - http:  
path: your-path  
method: post

function2:  
handler: handler.function2  
events: - http:  
path: your-path  
method: post

.  
.  
.

function3:  
handler: handler.function3  
events: - schedule:  
rate: cron(0 0 \* _ ? _) # Runs daily at midnight
