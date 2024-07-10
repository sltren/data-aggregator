import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { User } from "../../models/user-model";
import { userData as users } from "../../sample-data/user-data";
import { UserSchema } from "../../validations/user-schema";

export const seedUserData: APIGatewayProxyHandler =
  async (): Promise<APIGatewayProxyResult> => {
    try {
      // Validate users
      for (const user of users) {
        const { error } = UserSchema.validate(user);
        if (error) {
          throw new Error(`Validation error for user: ${error.message}`);
        }
      }

      await Promise.all(users.map((user) => User.put(user)));

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "User data seeded successfully" }),
      };
    } catch (error) {
      const typedError = error as Error;
      console.error("Error seeding user data:", typedError);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: typedError.message }),
      };
    }
  };
