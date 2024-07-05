import { Entity, Table } from "dynamodb-toolbox";
import { config } from "../validations/envValidation";
import { DocumentClient } from "./dynamo-db-client";

export interface UserItem {
  companyId: string;
  userId: string;
  email: string;
  fulName: string;
}

const table = new Table({
  name: config.usersTable,
  partitionKey: "companyId",
  sortKey: "userId",
  DocumentClient,
});

export const User = new Entity({
  name: config.usersTable,
  attributes: {
    companyId: { partitionKey: true, type: "string" },
    userId: { sortKey: true, type: "string" },
    email: { type: "string" },
    fullName: { type: "string" },
  },
  table,
});
