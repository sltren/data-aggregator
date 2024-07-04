import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const marshallOptions = {
  // Specify your client options as usual
  convertEmptyValues: false,
};

const translateConfig = { marshallOptions };

export const DocumentClient = DynamoDBDocumentClient.from(
  new DynamoDBClient(),
  translateConfig
);
