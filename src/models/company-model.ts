import { Entity, Table } from "dynamodb-toolbox";
import { config } from "../validations/envValidation";
import { DocumentClient } from "./dynamo-db-client";

const table = new Table({
  name: config.companiesTable,
  partitionKey: "companyId",
  DocumentClient,
});

export const Company = new Entity({
  name: config.companiesTable,
  attributes: {
    companyId: { partitionKey: true, type: "string" },
    companyName: { type: "string" },
  },
  table,
});
